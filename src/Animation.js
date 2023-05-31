import { cloneModelParametersCNN } from "./components/ModelViewPort/CNN/CNNHelpers";
import { Tensor } from "./Helpers";

export class AnimationQueue {
    constructor() {
        this.queue = new Queue();
        this.rewindStack = new Stack();
        this.returnToCurrentStack = new Stack();
        this.isPaused = false;
    }

    animate() {
        if (this.isPaused) {
            return;
        }
        let animation = this.returnToCurrentStack.isEmpty() ? this.queue.dequeue() : this.returnToCurrentStack.pop();
        if (animation === null) {
            return;
        }

        // sometimes you want multiple animations to start at the same time, so you must create a case for when delay = 0
        if (animation.data.delay <= 0) {
            animation.data.run();
            // rewinding functionality
            this.rewindStack.push(animation.data);
            this.animate();
        } else {
            let intervalId = setInterval(() => {
                animation.data.run();
                // rewinding functionality
                this.rewindStack.push(animation.data);
                clearInterval(intervalId);
                this.animate();
            }, animation.data.delay);
        }
    }

    playPrev() {
        if (this.rewindStack.isEmpty()) {
            return;
        }
        let animation = this.rewindStack.pop();

        if (animation.data.delay <= 0) {
            animation.data.run();
            // rewinding functionality
            this.returnToCurrentStack.push(animation.data);
        } else {
            let intervalId = setInterval(() => {
                animation.data.run();
                // rewinding functionality
                this.returnToCurrentStack.push(animation.data);
                clearInterval(intervalId);
            }, animation.data.delay);
        }
    }

    playNext() {
        let animation = this.returnToCurrentStack.isEmpty() ? this.queue.dequeue() : this.returnToCurrentStack.pop();
        if (animation === null) {
            return;
        }

        // sometimes you want multiple animations to start at the same time, so you must create a case for when delay = 0
        if (animation.data.delay <= 0) {
            animation.data.run();
            // rewinding functionality
            this.rewindStack.push(animation.data);
        } else {
            let intervalId = setInterval(() => {
                animation.data.run();
                // rewinding functionality
                this.rewindStack.push(animation.data);
                clearInterval(intervalId);
            }, animation.data.delay);
        }
    }

    togglePause() {
        if (this.isPaused) {
            this.isPaused = false;
            this.animate();
        } else {
            this.isPaused = true;
        }
    }
}

class Animation {
    constructor(callback, delay) {
        this.run = callback;
        this.delay = delay;
    }
}

class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    enqueue(data) {
        let node = new QueueNode(data);

        if (this.size <= 0) {
            this.first = node;
            this.last = this.first;
        } else {
            this.last.next = node;
            this.last = node;
        }

        this.size++;
        return;
    }

    dequeue() {
        if (this.size <= 0) {
            return null;
        } else if (this.size === 1) {
            let x = this.first;
            this.first = null;
            this.last = null;
            this.size--;
            return x;
        } else {
            let x = this.first;
            this.first = this.first.next;
            this.size--;
            return x;
        }
    }
}

class QueueNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.root = null;
    }

    push(data) {
        let newNode = new QueueNode(data);
        if (this.root === null) {
            this.root = newNode;
        } else {
            newNode.next = this.root;
            this.root = newNode;
        }
    }

    pop() {
        if (this.isEmpty()) {
            return null;
        }
        let x = this.root;
        this.root = this.root.next;
        return x;
    }

    isEmpty() {
        return this.root === null;
    }
}

export function CreateMLPAnimation(
    animationQueue,
    modelParameters,
    setModelParameters,
    trainedModelData,
    setDisplayedImageSrc,
    setDisplayedPrediction,
    setIsAnimating,
    speed
) {
    const timeMultiplier = SpeedMapperMLP(speed);

    const setIsAnimatingTrueCallback = () => {
        setIsAnimating(true);
    };
    const setIsAnimatingTrueAnimation = new Animation(setIsAnimatingTrueCallback, 0);
    animationQueue.queue.enqueue(setIsAnimatingTrueAnimation);

    const numImages = 5;
    let temp = structuredClone(modelParameters);
    // loop through every epoch
    let iterationNumber = 0;
    for (let epoch = 0; epoch < trainedModelData.length; epoch++) {
        let epochData = trainedModelData[epoch];
        // loop through every image (this is the "time" variable, always going to be the same for each epoch)
        for (let imageIndex = 0; imageIndex < numImages; imageIndex++) {
            /* CHANGE IMAGE */
            const currIterationNumber = iterationNumber;
            let displayedImageCallback_set = () => {
                setDisplayedImageSrc(trainedModelData.images[currIterationNumber + (epoch > 0 ? 1 : 0)]);
            };
            let displayedImageDelay_set = 0;
            let displayedImageAnimation_set = new Animation(displayedImageCallback_set, displayedImageDelay_set);
            animationQueue.queue.enqueue(displayedImageAnimation_set);

            /* FORWARD PROPAGATION */
            // zip information forward animation
            // loop through each layer
            for (let layerIndex = 0; layerIndex < epochData.layerHistory.length; layerIndex++) {
                let layerHistory = epochData.layerHistory[layerIndex];
                let synapseHistory = null;
                if (layerIndex < epochData.layerHistory.length - 1) {
                    synapseHistory = epochData.synapseHistory[layerIndex];
                }
                // creating animation this way is more efficient than each neuron/synapse calling setModelParameters on its own
                // since setModelParameters is called fewer times
                let neuronAnimationCallback_activate = () => {
                    temp = structuredClone(temp);
                    // loop through each neuron to activate
                    for (let neuronIndexLeft = 0; neuronIndexLeft < layerHistory.dims[0]; neuronIndexLeft++) {
                        temp.layerDisplay[layerIndex].neuronSigmas[neuronIndexLeft] = layerHistory.get([neuronIndexLeft, imageIndex]).Sigma;
                        temp.layerDisplay[layerIndex].neuronActivations[neuronIndexLeft] = layerHistory.get([
                            neuronIndexLeft,
                            imageIndex,
                        ]).ActivationOutput;
                        temp.layerDisplay[layerIndex].animationStates[neuronIndexLeft] = "animate--activate";

                        if (layerIndex < epochData.layerHistory.length - 1) {
                            // loop through each synapse
                            let synapseIndex = neuronIndexLeft * synapseHistory.dims[0];
                            for (let neuronIndexRight = 0; neuronIndexRight < synapseHistory.dims[0]; neuronIndexRight++) {
                                const currSynapseIndex = synapseIndex;
                                const currImageIndex = imageIndex;
                                temp.synapseDisplay[layerIndex].animationStates[currSynapseIndex] = "animate--activate";
                                if (currImageIndex < 1 && epoch < 1) {
                                    temp.synapseDisplay[layerIndex].currentWeights[currSynapseIndex] = synapseHistory.get([
                                        neuronIndexRight,
                                        neuronIndexLeft,
                                        imageIndex,
                                    ]).CurrentWeight;
                                }
                                temp.synapseDisplay[layerIndex].leftOutputs[currSynapseIndex] = synapseHistory.get([
                                    neuronIndexRight,
                                    neuronIndexLeft,
                                    imageIndex,
                                ]).LeftOutput;
                                temp.synapseDisplay[layerIndex].rightInputs[currSynapseIndex] = synapseHistory.get([
                                    neuronIndexRight,
                                    neuronIndexLeft,
                                    imageIndex,
                                ]).RightInput;
                                synapseIndex++;
                            }
                        }
                    }
                    setModelParameters(temp);
                };
                let neuronAnimationDelay_activate = 0;
                let neuronAnimation_activate = new Animation(neuronAnimationCallback_activate, neuronAnimationDelay_activate);
                animationQueue.queue.enqueue(neuronAnimation_activate);

                let neuronAnimationCallback_deactivate = () => {
                    temp = structuredClone(temp);
                    // loop through each neuron to deactivate
                    for (let neuronIndexLeft = 0; neuronIndexLeft < layerHistory.dims[0]; neuronIndexLeft++) {
                        temp.layerDisplay[layerIndex].animationStates[neuronIndexLeft] = "animate--deactivate";
                        if (layerIndex < epochData.layerHistory.length - 1) {
                            let synapseIndex = neuronIndexLeft * synapseHistory.dims[0];
                            for (let neuronIndexRight = 0; neuronIndexRight < synapseHistory.dims[0]; neuronIndexRight++) {
                                const currSynapseIndex = synapseIndex;
                                temp.synapseDisplay[layerIndex].animationStates[currSynapseIndex] = "animate--deactivate";
                                synapseIndex++;
                            }
                        }
                    }
                    setModelParameters(temp);
                };
                let neuronAnimationDelay_deactivate = 0;
                let delayAnimation = new Animation(() => {}, 250 * timeMultiplier);
                animationQueue.queue.enqueue(delayAnimation);
                let neuronAnimation_deactivate = new Animation(neuronAnimationCallback_deactivate, neuronAnimationDelay_deactivate);
                animationQueue.queue.enqueue(neuronAnimation_deactivate);
            }

            // /* UPDATE MODEL ACCURACY */
            // let changeAccuraciesAnimation = new Animation(() => {
            //   temp = structuredClone(temp);
            //   temp.accuracies.validationAccuracy = epochData.accuracyHistory[imageIndex].validationAccuracy + "%";
            //   temp.accuracies.testingAccuracy = epochData.accuracyHistory[imageIndex].testingAccuracy + "%";
            //   setModelParameters(temp);
            // }, 100 * timeMultiplier);
            // animationQueue.queue.enqueue(changeAccuraciesAnimation);

            /* DISPLAY PREDICTION */
            let displayedPredictionCallback_show = () => {
                let prediction = trainedModelData[epoch].predictions[imageIndex];
                setDisplayedPrediction(prediction);
            };
            let showPredictionAnimation = new Animation(displayedPredictionCallback_show, 0);
            animationQueue.queue.enqueue(showPredictionAnimation);

            let delayAnimation = new Animation(() => {}, 500 * timeMultiplier);
            animationQueue.queue.enqueue(delayAnimation);

            /* BACKWARD PROPAGATION */
            // wash-backwards animation
            // loop through each layer backwards
            if (imageIndex < numImages) {
                for (let layerIndex = epochData.layerHistory.length - 2; layerIndex >= 0; layerIndex--) {
                    let layerHistory = epochData.layerHistory[layerIndex];
                    let synapseHistory = epochData.synapseHistory[layerIndex];
                    // doing everything within ONE callback is much more efficient than calling setModelParameters for every single synapse
                    let synapseAnimationCallback_backprop = () => {
                        temp = structuredClone(temp);
                        // loop through each neuron on the left (order does not matter)
                        for (let neuronIndexLeft = 0; neuronIndexLeft < layerHistory.dims[0]; neuronIndexLeft++) {
                            // loop through each synapse
                            let synapseIndex = neuronIndexLeft * synapseHistory.dims[0];
                            for (let neuronIndexRight = 0; neuronIndexRight < synapseHistory.dims[0]; neuronIndexRight++) {
                                // remember that everything in here is for just ONE synapse at a time!
                                const currSynapseIndex = synapseIndex;
                                if (epoch < 1) {
                                    const synapseNewIndices = [neuronIndexRight, neuronIndexLeft, imageIndex + 1];
                                    const synapsePreviousIndices = [neuronIndexRight, neuronIndexLeft, imageIndex];

                                    // compute the color necessary to display
                                    let prevWeight = Number(synapseHistory.get(synapsePreviousIndices).CurrentWeight);
                                    let newWeight = Number(synapseHistory.get(synapseNewIndices).CurrentWeight);
                                    let color = ComputeBackPropColorsMLP(prevWeight, newWeight);

                                    let newWeightHistory = temp.synapseDisplay[layerIndex].weightHistories[currSynapseIndex];
                                    if (newWeightHistory === undefined) {
                                        newWeightHistory = [prevWeight];
                                    }

                                    newWeightHistory = newWeightHistory.slice();
                                    newWeightHistory.push(newWeight);

                                    temp.synapseDisplay[layerIndex].animationStates[currSynapseIndex] = `animate--backpropWash-${color}-activate`;
                                    temp.synapseDisplay[layerIndex].currentWeights[currSynapseIndex] = newWeight;
                                    temp.synapseDisplay[layerIndex].weightHistories[currSynapseIndex] = newWeightHistory;
                                } else {
                                    if (imageIndex < 1) {
                                        const synapseNewIndices = [neuronIndexRight, neuronIndexLeft, imageIndex];
                                        const synapsePreviousIndices = [neuronIndexRight, neuronIndexLeft, numImages];

                                        let newWeightHistory = temp.synapseDisplay[layerIndex].weightHistories[currSynapseIndex];
                                        newWeightHistory = newWeightHistory.slice();
                                        // compute the color necessary to display
                                        let prevWeight = newWeightHistory[newWeightHistory.length - 1];
                                        let newWeight = Number(synapseHistory.get(synapseNewIndices).CurrentWeight);
                                        let color = ComputeBackPropColorsMLP(prevWeight, newWeight);

                                        newWeightHistory.push(newWeight);

                                        temp.synapseDisplay[layerIndex].animationStates[currSynapseIndex] = `animate--backpropWash-${color}-activate`;
                                        temp.synapseDisplay[layerIndex].currentWeights[currSynapseIndex] = newWeight;
                                        temp.synapseDisplay[layerIndex].weightHistories[currSynapseIndex] = newWeightHistory;
                                    } else {
                                        const synapseNewIndices = [neuronIndexRight, neuronIndexLeft, imageIndex];
                                        const synapsePreviousIndices = [neuronIndexRight, neuronIndexLeft, numImages];

                                        let newWeightHistory = temp.synapseDisplay[layerIndex].weightHistories[currSynapseIndex];
                                        newWeightHistory = newWeightHistory.slice();
                                        // compute the color necessary to display
                                        let prevWeight = newWeightHistory[newWeightHistory.length - 1];
                                        let newWeight = Number(synapseHistory.get(synapseNewIndices).CurrentWeight);
                                        let color = ComputeBackPropColorsMLP(prevWeight, newWeight);

                                        newWeightHistory.push(newWeight);

                                        temp.synapseDisplay[layerIndex].animationStates[currSynapseIndex] = `animate--backpropWash-${color}-activate`;
                                        temp.synapseDisplay[layerIndex].currentWeights[currSynapseIndex] = newWeight;
                                        temp.synapseDisplay[layerIndex].weightHistories[currSynapseIndex] = newWeightHistory;
                                    }
                                }

                                synapseIndex++;
                            }
                        }
                        setModelParameters(temp);
                    };
                    let synapseAnimation_backprop = new Animation(synapseAnimationCallback_backprop, 0);
                    animationQueue.queue.enqueue(synapseAnimation_backprop);
                    let delayAnimation = new Animation(() => {}, 500 * timeMultiplier);
                    animationQueue.queue.enqueue(delayAnimation);
                }
                for (let layerIndex = epochData.layerHistory.length - 2; layerIndex >= 0; layerIndex--) {
                    let layerHistory = epochData.layerHistory[layerIndex];
                    let synapseHistory = epochData.synapseHistory[layerIndex];
                    let synapseAnimationCallback_backpropWash = () => {
                        temp = structuredClone(temp);
                        // loop through each neuron on the left (order does not matter)
                        for (let neuronIndexLeft = 0; neuronIndexLeft < layerHistory.dims[0]; neuronIndexLeft++) {
                            let synapseIndex = neuronIndexLeft * synapseHistory.dims[0];
                            // loop through each synapse
                            for (let neuronIndexRight = 0; neuronIndexRight < synapseHistory.dims[0]; neuronIndexRight++) {
                                // remember that everything in here is for just ONE synapse at a time!
                                const currSynapseIndex = synapseIndex;

                                temp.synapseDisplay[layerIndex].animationStates[currSynapseIndex] = `animate--backpropWash-neutral-activate`;
                                synapseIndex++;
                            }
                        }
                        setModelParameters(temp);
                    };
                    let synapseAnimationDelay_backpropWash = 0;
                    let synapseAnimation_backpropWash = new Animation(synapseAnimationCallback_backpropWash, synapseAnimationDelay_backpropWash);
                    animationQueue.queue.enqueue(synapseAnimation_backpropWash);
                    let delayAnimation = new Animation(() => {}, 200 * timeMultiplier);
                    animationQueue.queue.enqueue(delayAnimation);
                }
                let delayAnimation = new Animation(() => {}, 300 * timeMultiplier);
                animationQueue.queue.enqueue(delayAnimation); // backprop finishes, wait for 300ms before starting next forward prop
            }

            /* REMOVE PREDICTION */
            let displayedPredictionCallback_remove = () => {
                let prediction = null;
                setDisplayedPrediction(prediction);
            };
            let removePredictionAnimation = new Animation(displayedPredictionCallback_remove, 0);
            animationQueue.queue.enqueue(removePredictionAnimation);
            iterationNumber++;

            /* REMOVE IMAGE */
            let displayedImageCallback_remove = () => {
                setDisplayedImageSrc(null);
            };
            let displayedImageAnimation_remove = new Animation(displayedImageCallback_remove, 0);
            animationQueue.queue.enqueue(displayedImageAnimation_remove);
        }

        /* UPDATE MODEL ACCURACY */
        let changeAccuraciesAnimation = new Animation(() => {
            temp = structuredClone(temp);
            temp.accuracies.validationAccuracy = epochData.accuracyHistory.validationAccuracy + "%";
            temp.accuracies.trainingAccuracy = epochData.accuracyHistory.trainingAccuracy + "%";
            setModelParameters(temp);
        }, 100 * timeMultiplier);
        animationQueue.queue.enqueue(changeAccuraciesAnimation);
    }

    const setIsAnimatingFalseCallback = () => {
        setIsAnimating(false);
    };
    const setIsAnimatingFalseAnimation = new Animation(setIsAnimatingFalseCallback, 0);
    animationQueue.queue.enqueue(setIsAnimatingFalseAnimation);
}

function ComputeBackPropColorsMLP(prevWeight, newWeight) {
    let percentChange = (newWeight - prevWeight) / Math.abs(prevWeight);
    if (percentChange > 0.6) {
        return "darkGreen";
    } else if (percentChange > 0.3) {
        return "green";
    } else if (percentChange > 0) {
        return "lightGreen";
    } else if (percentChange < -0.6) {
        return "darkRed";
    } else if (percentChange < -0.3) {
        return "red";
    } else if (percentChange < 0) {
        return "lightRed";
    } else {
        return "neutral";
    }
}

export function CreateCNNAnimation(animationQueue, modelParameters, setModelParameters, trainedModelData, setIsAnimating, speed) {
    const timeMultiplier = SpeedMapperCNN(speed);

    const setIsAnimatingTrueCallback = () => {
        setIsAnimating(true);
    };
    const setIsAnimatingTrueAnimation = new Animation(setIsAnimatingTrueCallback, 0);
    animationQueue.queue.enqueue(setIsAnimatingTrueAnimation);

    let temp = cloneModelParametersCNN(modelParameters);
    const numImages = 5;
    // loop through each epoch
    let imageCount = 0;
    for (let epoch = 0; epoch < trainedModelData.length; epoch++) {
        let epochData = trainedModelData[epoch];
        // loop through every image (this is the "time" variable, always going to be the same for each epoch)
        for (let imageIndex = 0; imageIndex < numImages; imageIndex++) {
            /* CHANGE IMAGE */
            const currImageCount = imageCount;
            let displayedImageCallback_set = () => {
                temp = cloneModelParametersCNN(temp);
                temp.animationProperties.displayedImageSrc = trainedModelData.images[currImageCount + (epoch > 0 ? 1 : 0)];
                console.log("displauedImageCallback_set, currImageCount:", currImageCount);
                console.log("trainedModelData.images.length:", trainedModelData.images.length);
                setModelParameters(temp);
            };
            let displayedImageDelay_set = 0;
            let displayedImageAnimation_set = new Animation(displayedImageCallback_set, displayedImageDelay_set);
            animationQueue.queue.enqueue(displayedImageAnimation_set);

            // 500ms delay
            animationQueue.queue.enqueue(new Animation(() => {}, 500 * timeMultiplier));

            /* FORWARD PROPAGATION */
            /* Brief Description:
        - Scanning across image and activation maps
        - Creating activation maps by throwing "orbs" at them
        - Staggered, but not sequential. Eventually all 6 filters should be seen scanning simultaneously (to save time)
        - Output a prediction at the end of forward propagation
        - Do something small for back propagation

        All of these animations might actually be created in the CNNHelpers.js file using orchestrated framer-motion animations,
        because calling setModelParameters has proven itself time and time again to be too slow when done this many times.

        The purpose of these "animations" in the AnimationQueue will simply be to change the state from forward prop to back prop.
        This is a different approach from the one I took with the MLP animation, where setting state was done sparingly enough that
        the whole thing didn't lag. Here, for the CNN, it is simply too much for the browser to handle (especially with JavaScript
          being single-threaded and all...)

      */

            // let startStrideAnimationCallback = () => {
            //   temp = cloneModelParametersCNN(temp);
            //   for (let layerIndex = 0; layerIndex < epochData.layerHistory.length; layerIndex++) {
            //     let layerHistory = epochData.layerHistory[layerIndex];
            //     let activationMapHistory = layerHistory.activationMapHistory;
            //     let filterWeightHistory = layerHistory.filterWeightHistory;

            //     // we know there is at least one filter in each layer, so this is safe
            //     let activationMapSize = activationMapHistory[0][imageIndex].dims[0];
            //     let filterSize = temp.layerInfo[layerIndex].filterSize;
            //     let numFilters = temp.layerInfo[layerIndex].numFilters;

            //     for (let f = 0; f < numFilters; f++) {
            //       // update all the filter weights and all the activation maps for the layer
            //       temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][imageIndex];
            //       temp.layerInfo[layerIndex].activationMaps[f] = activationMapHistory[f][imageIndex];

            //       // update the filter weight history for every filter
            //       temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][imageIndex]);
            //     }
            //   }
            //   temp.animationProperties.animationState = "startStrideAnimation";
            //   setModelParameters(temp);
            // };
            // let startStrideAnimation = new Animation(startStrideAnimationCallback, 0);
            // animationQueue.queue.enqueue(startStrideAnimation);

            // animationQueue.queue.enqueue(new Animation(() => {}, 25_000));

            // let endStrideAnimationCallback = () => {
            //   temp = cloneModelParametersCNN(temp);
            //   for (let layerIndex = 0; layerIndex < epochData.layerHistory.length; layerIndex++) {
            //     let layerHistory = epochData.layerHistory[layerIndex];
            //     let activationMapHistory = layerHistory.activationMapHistory;
            //     let filterWeightHistory = layerHistory.filterWeightHistory;

            //     // we know there is at least one filter in each layer, so this is safe
            //     let activationMapSize = activationMapHistory[0][imageIndex].dims[0];
            //     let filterSize = temp.layerInfo[layerIndex].filterSize;
            //     let numFilters = temp.layerInfo[layerIndex].numFilters;

            //     for (let f = 0; f < numFilters; f++) {
            //       // update all the filter weights and all the activation maps for the layer
            //       temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][imageIndex];
            //       temp.layerInfo[layerIndex].activationMaps[f] = activationMapHistory[f][imageIndex];

            //       // update the filter weight history for every filter
            //       temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][imageIndex]);
            //     }
            //   }
            //   temp.animationProperties.animationState = "endStrideAnimation";
            //   setModelParameters(temp);
            // };

            // for (let layerIndex = 0; layerIndex < epochData.layerHistory.length; layerIndex++) {
            //   let layerHistory = epochData.layerHistory[layerIndex];
            //   let activationMapHistory = layerHistory.activationMapHistory;
            //   let filterWeightHistory = layerHistory.filterWeightHistory;
            //   // we know there is at least one filter in each layer, so this is safe
            //   let activationMapSize = activationMapHistory[0][imageIndex].dims[0];
            //   let filterSize = temp.layerInfo[layerIndex].filterSize;
            //   let numFilters = temp.layerInfo[layerIndex].numFilters;

            //   // this callback will first update modelParameters with the new values before beginning to play an animation
            //   let updateLayerInfoCallback = () => {
            //     console.log("UpdateLayerInfo Animation Played!");
            //     temp = cloneModelParametersCNN(temp);
            //     console.log("Animation.js temp: ", temp);

            //     const currNumFilters = numFilters;
            //     if (temp.animationProperties.layerAnimations[layerIndex] === null) {
            //       temp.animationProperties.layerAnimations[layerIndex] = new Array(currNumFilters);
            //       for (let f = 0; f < currNumFilters; f++) {
            //         temp.animationProperties.layerAnimations[layerIndex][f] = {};
            //       }
            //     }
            //     for (let f = 0; f < currNumFilters; f++) {
            //       // update all the filter weights and all the activation maps for the layer
            //       temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][imageIndex];
            //       temp.layerInfo[layerIndex].activationMaps[f] = activationMapHistory[f][imageIndex];

            //       // update the filter weight history for every filter
            //       temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][imageIndex]);

            //       // // initialize the stridePos
            //       // let initialStridePos = {
            //       //   iPos: -1,
            //       //   jPos: activationMapSize - f * filterSize,
            //       // };
            //       // temp.animationProperties.layerAnimations[layerIndex][f].stridePos = initialStridePos;
            //     }

            //     setModelParameters(temp);
            //   };

            //   let updateLayerInfoDelay = 0;
            //   let updateLayerInfoAnimation = new Animation(updateLayerInfoCallback, updateLayerInfoDelay);
            //   animationQueue.queue.enqueue(updateLayerInfoAnimation);

            //   let startStrideAnimationCallback = () => {
            //     temp = cloneModelParametersCNN(temp);
            //     temp.animationProperties.layerAnimations[layerIndex] = "startStrideAnimation";
            //     setModelParameters(temp);
            //   };
            //   let startStrideAnimationDelay = 0;
            //   let startStrideAnimation = new Animation(startStrideAnimationCallback, startStrideAnimationDelay);
            //   animationQueue.queue.enqueue(startStrideAnimation);

            //   // let delayAnimation = new Animation(() => {}, 12000);
            //   // animationQueue.queue.enqueue(delayAnimation);

            //   const currImageCount = imageCount;
            //   let endStrideAnimationCallback = () => {
            //     temp = cloneModelParametersCNN(temp);
            //     for (let i = 0; i < epochData.layerHistory.length; i++) {
            //       temp.animationProperties.layerAnimations[i] = null;
            //     }
            //     if (layerIndex === 0 && currImageCount > 0) {
            //       temp.animationProperties.layerAnimations[epochData.layerHistory.length - 1] = "endStrideAnimation";
            //     } else if (layerIndex > 0) {
            //       temp.animationProperties.layerAnimations[layerIndex - 1] = "endStrideAnimation";
            //     }
            //     setModelParameters(temp);
            //   };
            //   let endStrideAnimationDelay = 5000;
            //   let endStrideAnimation = new Animation(endStrideAnimationCallback, endStrideAnimationDelay);
            //   animationQueue.queue.enqueue(endStrideAnimation);
            // }

            for (let layerIndex = 0; layerIndex < epochData.layerHistory.length; layerIndex++) {
                let layerHistory = epochData.layerHistory[layerIndex];
                let activationMapHistory = layerHistory.activationMapHistory;
                let filterWeightHistory = layerHistory.filterWeightHistory;
                // we know there is at least one filter in each layer, so this is safe
                let activationMapSize = activationMapHistory[0][imageIndex].dims[0];
                let filterSize = temp.layerInfo[layerIndex].filterSize;
                let numFilters = temp.layerInfo[layerIndex].numFilters;

                // this callback will first update modelParameters with the new values before beginning to play an animation
                let updateLayerInfoCallback = () => {
                    console.log("UpdateLayerInfo Animation Played!");
                    temp = cloneModelParametersCNN(temp);
                    console.log("Animation.js temp: ", temp);

                    const currNumFilters = numFilters;
                    if (temp.animationProperties.layerAnimations[layerIndex] === null) {
                        temp.animationProperties.layerAnimations[layerIndex] = new Array(currNumFilters);
                        for (let f = 0; f < currNumFilters; f++) {
                            temp.animationProperties.layerAnimations[layerIndex][f] = {};
                        }
                    }
                    if (currImageCount == 0) {
                        for (let f = 0; f < currNumFilters; f++) {
                            // update all the filter weights and all the activation maps for the layer
                            temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][currImageCount];
                            temp.layerInfo[layerIndex].activationMaps[f] = activationMapHistory[f][currImageCount];

                            // update the filter weight history for every filter
                            temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][currImageCount]);
                        }

                        setModelParameters(temp);
                    } else {
                        for (let f = 0; f < currNumFilters; f++) {
                            // update all the filter weights and all the activation maps for the layer
                            temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][imageIndex];
                            temp.layerInfo[layerIndex].activationMaps[f] = activationMapHistory[f][imageIndex];

                            // update the filter weight history for every filter
                            temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][imageIndex]);
                        }

                        setModelParameters(temp);
                    }
                };

                let updateLayerInfoDelay = 0;
                let updateLayerInfoAnimation = new Animation(updateLayerInfoCallback, updateLayerInfoDelay);
                animationQueue.queue.enqueue(updateLayerInfoAnimation);

                let startStrideAnimationCallback = () => {
                    temp = cloneModelParametersCNN(temp);
                    temp.animationProperties.layerAnimations[layerIndex] = "startStrideAnimation";
                    setModelParameters(temp);
                };
                let startStrideAnimationDelay = 0;
                let startStrideAnimation = new Animation(startStrideAnimationCallback, startStrideAnimationDelay);
                animationQueue.queue.enqueue(startStrideAnimation);

                let delayAnimation = new Animation(
                    () => {},
                    layerIndex === epochData.layerHistory.length - 1 ? 5000 * timeMultiplier : 7500 * timeMultiplier
                );
                animationQueue.queue.enqueue(delayAnimation);

                // const currImageCount = imageCount;
                // let endStrideAnimationCallback = () => {
                //   temp = cloneModelParametersCNN(temp);
                //   temp.animationProperties.layerAnimations[layerIndex] = "endStrideAnimation";
                //   setModelParameters(temp);
                // };
                // let endStrideAnimationDelay = 000;
                // let endStrideAnimation = new Animation(endStrideAnimationCallback, endStrideAnimationDelay);
                // animationQueue.queue.enqueue(endStrideAnimation);
            }

            // /* UPDATE MODEL ACCURACY */
            // let changeAccuraciesAnimation = new Animation(() => {
            //     temp = cloneModelParametersCNN(temp);
            //     temp.accuracies.validationAccuracy = epochData.accuracyHistory[imageIndex].validationAccuracy + "%";
            //     temp.accuracies.testingAccuracy = epochData.accuracyHistory[imageIndex].testingAccuracy + "%";
            //     setModelParameters(temp);
            // }, 100 * timeMultiplier);
            // animationQueue.queue.enqueue(changeAccuraciesAnimation);

            /* DISPLAY PREDICTION */
            let displayedPredictionCallback_show = () => {
                temp = cloneModelParametersCNN(temp);
                temp.animationProperties.displayedPrediction = trainedModelData[epoch].predictions[imageIndex];
                setModelParameters(temp);
            };
            let showPredictionAnimation = new Animation(displayedPredictionCallback_show, 500);
            animationQueue.queue.enqueue(showPredictionAnimation);

            /*  BACKPROPAGATION */
            for (let layerIndex = epochData.layerHistory.length - 1; layerIndex >= 0; layerIndex--) {
                let layerHistory = epochData.layerHistory[layerIndex];
                let activationMapHistory = layerHistory.activationMapHistory;
                let filterWeightHistory = layerHistory.filterWeightHistory;
                // we know there is at least one filter in each layer, so this is safe
                let activationMapSize = activationMapHistory[0][imageIndex].dims[0];
                let filterSize = temp.layerInfo[layerIndex].filterSize;
                let numFilters = temp.layerInfo[layerIndex].numFilters;

                // // this callback will first update modelParameters with the new values before beginning to play an animation
                // let updateLayerInfoCallback = () => {
                //   console.log("UpdateLayerInfo Animation Played!");
                //   temp = cloneModelParametersCNN(temp);
                //   console.log("Animation.js temp: ", temp);

                //   const currNumFilters = numFilters;
                //   if (temp.animationProperties.layerAnimations[layerIndex] === null) {
                //     temp.animationProperties.layerAnimations[layerIndex] = new Array(currNumFilters);
                //     for (let f = 0; f < currNumFilters; f++) {
                //       temp.animationProperties.layerAnimations[layerIndex][f] = {};
                //     }
                //   }
                //   for (let f = 0; f < currNumFilters; f++) {
                //     // update all the filter weights and all the activation maps for the layer
                //     temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][imageIndex];
                //     temp.layerInfo[layerIndex].activationMaps[f] = activationMapHistory[f][imageIndex];
                //     // update the filter weight history for every filter
                //     temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][imageIndex]);
                //   }

                //   setModelParameters(temp);
                // };

                // let updateLayerInfoDelay = 0;
                // let updateLayerInfoAnimation = new Animation(updateLayerInfoCallback, updateLayerInfoDelay);
                // animationQueue.queue.enqueue(updateLayerInfoAnimation);

                let BackPropAnimationCallback = () => {
                    temp = cloneModelParametersCNN(temp);
                    temp.animationProperties.layerAnimations[layerIndex] = "backPropAnimation";
                    const currImageIndex = imageIndex;
                    const currNumFilters = numFilters;
                    const currEpoch = epoch;
                    console.log("Num Filters: " + currNumFilters);
                    if (epoch < 1) {
                        for (let f = 0; f < currNumFilters; f++) {
                            temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][currImageIndex + 1];
                            console.log("filterWeightHistory[f]: ");
                            console.log(filterWeightHistory[f]);
                            // update the filter weight history for every filter
                            // if (currImageCount > 0) {
                            temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][currImageIndex + 1]);
                            // }
                            console.log("temp.layerInfo[layerIndex].filterWeights[f] : " + temp.layerInfo[layerIndex].filterWeights[f]);
                            console.log("[f]: " + f);
                            console.log("currImageIndex: " + currImageIndex);
                        }
                    } else {
                        for (let f = 0; f < currNumFilters; f++) {
                            console.log("filterWeightHistory[f]: ");
                            console.log(filterWeightHistory[f]);
                            temp.layerInfo[layerIndex].filterWeights[f] = filterWeightHistory[f][currImageIndex];
                            // update the filter weight history for every filter
                            temp.layerInfo[layerIndex].filterWeightHistories[f].push(filterWeightHistory[f][currImageIndex]);
                            console.log("temp.layerInfo[layerIndex].filterWeights[f] : " + temp.layerInfo[layerIndex].filterWeights[f]);
                            console.log("[f]: " + f);
                            console.log("currImageIndex: " + currImageIndex);
                        }
                    }
                    setModelParameters(temp);
                };
                let BackPropAnimationDelay = 1000 * timeMultiplier;
                let BackPropAnimation = new Animation(BackPropAnimationCallback, BackPropAnimationDelay);
                animationQueue.queue.enqueue(BackPropAnimation);

                let delayAnimation = new Animation(() => {}, 300 * timeMultiplier);
                animationQueue.queue.enqueue(delayAnimation);
            }

            // un-render all the Animation Components
            let NullAnimationCallback = () => {
                console.log("Null Animation");
                temp = cloneModelParametersCNN(temp);
                for (let layerIndex = 0; layerIndex < epochData.layerHistory.length; layerIndex++) {
                    temp.animationProperties.layerAnimations[layerIndex] = null;
                }
                console.log(temp);
                setModelParameters(temp);
            };
            let NullAnimation = new Animation(NullAnimationCallback, 0);
            animationQueue.queue.enqueue(NullAnimation);

            let delayAnimation = new Animation(() => {}, 1000);
            animationQueue.queue.enqueue(delayAnimation);

            /* REMOVE PREDICTION */
            let displayedPredictionCallback_remove = () => {
                temp = cloneModelParametersCNN(temp);
                temp.animationProperties.displayedPrediction = null;
                setModelParameters(temp);
            };
            let removePredictionAnimation = new Animation(displayedPredictionCallback_remove, 0);
            animationQueue.queue.enqueue(removePredictionAnimation);

            /* REMOVE IMAGE */
            let displayedImageCallback_remove = () => {
                temp = cloneModelParametersCNN(temp);
                temp.animationProperties.displayedImageSrc = null;
                setModelParameters(temp);
            };
            let displayedImageAnimation_remove = new Animation(displayedImageCallback_remove, 0);
            animationQueue.queue.enqueue(displayedImageAnimation_remove);

            imageCount++;
        }
        /* UPDATE MODEL ACCURACY */
        let changeAccuraciesAnimation = new Animation(() => {
            temp = cloneModelParametersCNN(temp);
            temp.accuracies.validationAccuracy = epochData.accuracyHistory.validationAccuracy + "%";
            temp.accuracies.trainingAccuracy = epochData.accuracyHistory.trainingAccuracy + "%";
            setModelParameters(temp);
        }, 100 * timeMultiplier);
        animationQueue.queue.enqueue(changeAccuraciesAnimation);
    }

    const setIsAnimatingFalseCallback = () => {
        setIsAnimating(false);
    };
    const setIsAnimatingFalseAnimation = new Animation(setIsAnimatingFalseCallback, 0);
    animationQueue.queue.enqueue(setIsAnimatingFalseAnimation);
}

function SpeedMapperMLP(speed) {
    switch (speed) {
        case "Slow":
            return 2;
        case "Average":
            return 1;
        case "Fast":
            return 0.5;
    }
}

function SpeedMapperCNN(speed) {
    switch (speed) {
        case "Slow":
            return 1.35;
        case "Average":
            return 1;
        case "Fast":
            return 0.65;
    }
}
