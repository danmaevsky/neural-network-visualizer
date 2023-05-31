import { Tensor } from "../../../Helpers";
import { cloneModelParametersCNN } from "../../ModelViewPort/CNN/CNNHelpers";
import "./NetworkInfoBar.css";
import addLayerButtonSvg from "./addLayerButton.svg";
import removeLayerButtonSvg from "./removeLayerButton.svg";
import backButton from "../../../resources/Back.svg";
import playButton from "../../../resources/Play.svg";
import pauseButton from "../../../resources/Pause.svg";
import forwardButton from "../../../resources/Forward.svg";

import { useToggle } from "../../../hooks/useToggle";

const BackendURL = process.env.REACT_APP_BACKEND_URL;
const dataset_mapper = {
    MNIST: "mnist",
    "CIFAR-10": "cifar10",
    Gems: "gems",
    "Playing Cards": "cards",
};
const activation_function_mapper = {
    Sigmoid: "sigmoid",
    Tanh: "tanh",
    ReLU: "relu",
    "Leaky ReLU": "leaky-relu",
    ELU: "elu",
    Swish: "swish",
};

export function NetworkInfoBar(props) {
    const modelParameters = props.modelParameters;
    const setModelParameters = props.setModelParameters;
    const setSelectedLayer = props.setSelectedLayer;
    const setShowLayerInfoBox = props.setShowLayerInfoBox;
    const setTrainedModelData = props.setTrainedModelData;
    const setParameterWarning = props.setParameterWarning;
    const isAnimating = props.isAnimating;
    const animationQueue = props.animationQueue;

    // network stuff
    const setLoadingStatus = props.setLoadingStatus;

    const networkType = modelParameters.networkType;
    const dataset = modelParameters.dataset;
    const validationAccuracy = modelParameters.accuracies.validationAccuracy;
    const trainingAccuracy = modelParameters.accuracies.trainingAccuracy;

    const checkIsDefined = (s) => {
        return s !== null && s !== undefined ? s : "Not Defined Yet";
    };

    // setting networkType-sensitive functions and values
    let visualizeButtonOnClick = () => {};
    let removeLayerButtonOnClick = () => {};
    let addLayerButtonOnClick = () => {};
    let numLayers = 0;
    let numNodes = 0;
    let maxLayers = 0;
    if (modelParameters.networkType === "Multilayer Perceptron Network") {
        maxLayers = 8;
        numLayers = modelParameters.numNeuronsPerLayer.length;
        numNodes = modelParameters.numNeuronsPerLayer.reduce((prev, curr) => {
            return prev + curr;
        }, 0);
        visualizeButtonOnClick = () => {
            let status = validateModelParamsMLP(modelParameters);
            if (!status.valid) {
                setParameterWarning({
                    status: status,
                    showWarning: true,
                });
                return;
            }
            fetchModelDataMLP(modelParameters, setTrainedModelData, setLoadingStatus);
        };
        removeLayerButtonOnClick = () => removeLayerButtonOnClickMLP(modelParameters, setModelParameters);
        addLayerButtonOnClick = () => addLayerButtonOnClickMLP(numLayers, modelParameters, setModelParameters, setShowLayerInfoBox, setSelectedLayer);
    } else if (modelParameters.networkType === "Convolutional Neural Network") {
        maxLayers = 6;
        numLayers = modelParameters.layerInfo.length;
        numNodes = modelParameters.layerInfo.reduce((prev, curr) => {
            return prev + curr.numFilters;
        }, 0);
        visualizeButtonOnClick = () => {
            let status = validateModelParamsCNN(modelParameters);
            if (!status.valid) {
                setParameterWarning({
                    status: status,
                    showWarning: true,
                });
                return;
            }
            fetchModelDataCNN(modelParameters, setTrainedModelData, setLoadingStatus);
        };
        addLayerButtonOnClick = () => addLayerButtonOnClickCNN(numLayers, modelParameters, setModelParameters, setShowLayerInfoBox, setSelectedLayer);
        removeLayerButtonOnClick = () => removeLayerButtonOnClickCNN(modelParameters, setModelParameters);
    } else if (modelParameters.networkType === "Recurrent Neural Network") {
    }

    return (
        <div className="NetworkInfoBar">
            <div className="networkInfoBarTextArea">
                <h1>Network Information</h1>
                <div className="networkInfoBarText networkInfoBarTextAreaColumn1">
                    <div>
                        <p>{`Network Type:`}</p>
                        <p>{`Dataset:`}</p>
                    </div>
                    <div>
                        <p>{checkIsDefined(networkType)}</p>
                        <p>{checkIsDefined(dataset)}</p>
                    </div>
                </div>
                <div className="networkInfoBarText networkInfoBarTextAreaColumn2">
                    <div>
                        <p>{`Layers:`}</p>
                        <p>{`Nodes:`}</p>
                    </div>
                    <div>
                        <p>{checkIsDefined(numLayers)}</p>
                        <p>{checkIsDefined(numNodes)}</p>
                    </div>
                </div>
                <div className="networkInfoBarText networkInfoBarTextAreaColumn3">
                    <div>
                        <p>{`Training Accuracy:`}</p>
                        <p>{`Validation Accuracy:`}</p>
                    </div>
                    <div>
                        <p>{checkIsDefined(trainingAccuracy)}</p>
                        <p>{checkIsDefined(validationAccuracy)}</p>
                    </div>
                </div>
            </div>
            {modelParameters.networkType === null || modelParameters.preset !== null || isAnimating ? null : (
                <NetworkInfoBarButtons
                    enableRemove={numLayers > 1 && !isAnimating}
                    enableAdd={numLayers < maxLayers && !isAnimating}
                    removeOnClick={removeLayerButtonOnClick}
                    addOnClick={addLayerButtonOnClick}
                />
            )}
            {isAnimating ? <NetworkPlaybackButtons animationQueue={animationQueue} /> : null}
            <button className={isAnimating ? "disabledVisualizeButton" : "visualizeButton"} onClick={isAnimating ? null : visualizeButtonOnClick}>
                Visualize
            </button>
        </div>
    );
}

function NetworkInfoBarButtons(props) {
    const enableRemove = props.enableRemove;
    const enableAdd = props.enableAdd;
    const removeOnClick = props.removeOnClick;
    const addOnClick = props.addOnClick;

    return (
        <div className="networkInfoBarButtons" exit={{ opacity: 0, transition: { duration: 0.2 } }} key={"networkInfoBarButtons"}>
            <>
                <input
                    type="image"
                    className={enableRemove ? "removeLayerButton" : "disabledRemoveLayerButton"}
                    src={removeLayerButtonSvg}
                    onClick={enableRemove ? removeOnClick : null}
                    alt="removeLayerButton"
                />
                <input
                    type="image"
                    className={enableAdd ? "addLayerButton" : "disabledAddLayerButton"}
                    src={addLayerButtonSvg}
                    onClick={enableAdd ? addOnClick : null}
                    alt="addLayerButton"
                />
            </>
        </div>
    );
}

function NetworkPlaybackButtons(props) {
    const animationQueue = props.animationQueue;
    const [isPaused, toggleIsPaused] = useToggle(false);
    let playPauseOnClick = () => {
        toggleIsPaused();
        animationQueue.togglePause();
    };
    let backOnClick = () => animationQueue.playPrev();
    let forwardOnClick = () => animationQueue.playNext();

    return (
        <div className="networkPlaybackButtons" exit={{ opacity: 0, transition: { duration: 0.2 } }} key={"networkPlayBackButtons"}>
            {/* <img className={isPaused ? "playbackButton" : "disabledPlaybackButton"} src={backButton} onClick={isPaused ? backOnClick : null} /> */}
            <input
                type="image"
                className="playPausePlaybackButton"
                src={isPaused ? playButton : pauseButton}
                onClick={playPauseOnClick}
                alt="Play or Pause Button"
            />
            <input
                type="image"
                className={isPaused ? "playbackButton" : "disabledPlaybackButton"}
                src={forwardButton}
                onClick={isPaused ? forwardOnClick : null}
                alt="Step Forward Playback Button"
            />
        </div>
    );
}

/* PARAMETERIZING THE EVENT HANDLERS TO HANDLE DIFFERENT NETWORK TYPES */
// different types of 'fetch' functions
function fetchModelDataRNN(modelParameters, setTrainedModelData) {}

// MULTILAYER PERCEPTRON FUNCTIONS
function validateModelParamsMLP(modelParameters) {
    if (modelParameters.dataset === null) {
        return {
            problem: "dataset",
            valid: false,
        };
    }
    if (modelParameters.numNeuronsPerLayer.length > 8) {
        return {
            problem: "numLayersTooBig",
            valid: false,
        };
    }
    if (modelParameters.numNeuronsPerLayer.length < 1) {
        return {
            problem: "numLayersTooSmall",
            valid: false,
        };
    }
    for (let i = 0; i < modelParameters.numNeuronsPerLayer.length; i++) {
        let layerInfo = {
            activationFunction: modelParameters.activationFunctions[i],
            numNeurons: modelParameters.numNeuronsPerLayer[i],
        };
        if (layerInfo.activationFunction === "Undef") {
            return {
                problem: "activationFunction",
                layer: i,
                valid: false,
            };
        } else if (layerInfo.numNeurons < 1) {
            return {
                problem: "numFiltersTooSmall",
                layer: i,
                numNeurons: layerInfo.numNeurons,
                valid: false,
            };
        } else if (layerInfo.numNeurons > 10) {
            return {
                problem: "numFiltersTooBig",
                layer: i,
                numNeurons: layerInfo.numNeurons,
                valid: false,
            };
        }
    }
    return {
        valid: true,
    };
}
async function fetchModelDataMLP(modelParameters, setTrainedModelData, setLoadingStatus) {
    setLoadingStatus({ status: "isLoading", showWarning: false });
    // gathering relevant parameters from modelParameters to send to server
    console.log(modelParameters.activationFunctions);
    let relevantParams = {
        networkType: modelParameters.networkType,
        dataset: dataset_mapper[modelParameters.dataset],
        numNeuronsPerLayer: modelParameters.numNeuronsPerLayer,
        activationFunctions: modelParameters.activationFunctions.map((actFunc) => activation_function_mapper[actFunc]),
    };

    // build the request object
    let request = {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relevantParams),
    };

    // asynchronously process and await the server response
    let firstFetchResult = await fetch(BackendURL + "mlp", request)
        .then((resp) => resp.json())
        .then((resp) => {
            /*
      The format of the response JSON is something like this
      resp := [
        epoch1 := {
          layerHistory: [...],
          synapseHistory: [...],
          accuracyHistory: [...],
          imageUrls: [...]
        },
        epoch2 := {
          <information>
        },
        etc
      ]
      */

            // processing response JSON into useful Tensor instances
            let trainedModelData = resp.map((epoch) => {
                return {
                    layerHistory: epoch.layerHistory.map((l) => {
                        return new Tensor(l.dims, l.values);
                    }),
                    synapseHistory: epoch.synapseHistory.map((s) => {
                        return new Tensor(s.dims, s.values);
                    }),
                    accuracyHistory: epoch.accuracyHistory,
                    predictions: epoch.predictions,
                };
            });

            // start fetching image documents from the server
            let imagePromises = [];
            for (let e = 0; e < resp.length; e++) {
                for (let i = 0; i < resp[e].imageURLs.length; i++) {
                    let imageRequest = {
                        method: "POST",
                        mode: "cors",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageUrl: resp[e].imageURLs[i] }),
                    };
                    imagePromises.push(fetch(BackendURL + "datasets", imageRequest));
                }
            }
            return [trainedModelData, imagePromises];
        })
        .catch((err) => {
            console.log(err);
            setLoadingStatus({ status: "fail", showWarning: true });
        });

    if (firstFetchResult === undefined) {
        return;
    }
    let trainedModelData = firstFetchResult[0];
    let imagePromises = firstFetchResult[1];

    // after image documents have been retrieved, take their data and convert it to Blob
    let imageBlobs = await Promise.all(imagePromises)
        .then((responses) => {
            // blobify
            let blobs = responses.map((r) => r.blob());
            return blobs;
        })
        .catch(() => {
            setLoadingStatus({ status: "fail", showWarning: true });
        });

    // Because blobifying is asynchronous, wait for that to be done and then create real images out of the blobs.
    // Upon completion, update trainedModelData and call the state-setter
    await Promise.all(imageBlobs)
        .then((blobs) => {
            trainedModelData.images = blobs.map((b) => URL.createObjectURL(b));
            setTrainedModelData(trainedModelData);
        })
        .catch(() => {
            setLoadingStatus({ status: "fail", showWarning: true });
        });

    setLoadingStatus({ status: "done", showWarning: false });
}

function removeLayerButtonOnClickMLP(modelParameters, setModelParameters) {
    let temp = structuredClone(modelParameters);
    temp.numNeuronsPerLayer.pop();
    temp.activationFunctions.pop();
    for (let i = 0; i < temp.numNeuronsPerLayer.length; i++) {
        temp.layerDisplay[i] = {
            neuronSigmas: new Array(temp.numNeuronsPerLayer[i]).fill("N/A"),
            neuronActivations: new Array(temp.numNeuronsPerLayer[i]).fill("N/A"),
            animationStates: new Array(temp.numNeuronsPerLayer[i]).fill(""),
        };
    }
    for (let i = 1; i < temp.numNeuronsPerLayer.length; i++) {
        let numSynapses = temp.numNeuronsPerLayer[i - 1] * temp.numNeuronsPerLayer[i];
        let numEpochs = 0;
        temp.synapseDisplay[i - 1] = {
            leftOutputs: new Array(temp.numNeuronsPerLayer[i - 1]).fill("N/A"),
            currentWeights: new Array(numSynapses).fill("N/A"),
            rightInputs: new Array(temp.numNeuronsPerLayer[i]).fill("N/A"),
            weightHistories: new Array(numSynapses * numEpochs).fill(null),
            animationStates: new Array(numSynapses).fill(""),
        };
    }
    setModelParameters(temp);
}

function addLayerButtonOnClickMLP(numLayers, modelParameters, setModelParameters, setShowLayerInfoBox, setSelectedLayer) {
    if (modelParameters.networkType === "Multilayer Perceptron Network" && numLayers >= 8) {
        return;
    }
    let temp = structuredClone(modelParameters);
    /* Will rework MLP's modelParameters later. No point right now */

    // temp.layerInfo.push({
    //   numNeurons: 1,
    //   activationFunction: ["Undef"],
    //   neuronSigmas: ["N/A"],
    //   neuronActivation: ["N/A"],

    // })
    temp.numNeuronsPerLayer.push(1);
    temp.activationFunctions.push("Undef");
    console.log(temp);
    for (let i = 0; i < temp.numNeuronsPerLayer.length; i++) {
        temp.layerDisplay[i] = {
            neuronSigmas: new Array(temp.numNeuronsPerLayer[i]).fill("N/A"),
            neuronActivations: new Array(temp.numNeuronsPerLayer[i]).fill("N/A"),
            animationStates: new Array(temp.numNeuronsPerLayer[i]).fill(""),
        };
    }
    for (let i = 1; i < temp.numNeuronsPerLayer.length; i++) {
        let numSynapses = temp.numNeuronsPerLayer[i - 1] * temp.numNeuronsPerLayer[i];
        let numEpochs = 0;
        temp.synapseDisplay[i - 1] = {
            leftOutputs: new Array(temp.numNeuronsPerLayer[i - 1]).fill("N/A"),
            currentWeights: new Array(numSynapses).fill("N/A"),
            rightInputs: new Array(temp.numNeuronsPerLayer[i]).fill("N/A"),
            weightHistories: new Array(numSynapses * numEpochs).fill(null),
            animationStates: new Array(numSynapses).fill(""),
        };
    }
    setModelParameters(temp);
    setShowLayerInfoBox(true);
    setSelectedLayer(temp.numNeuronsPerLayer.length - 1);
}

// CONVOLUTIONAL NEURAL NETWORK FUNCTIONS
function validateModelParamsCNN(modelParameters) {
    if (modelParameters.dataset === null) {
        return {
            problem: "dataset",
            valid: false,
        };
    }
    if (modelParameters.layerInfo.length > 6) {
        return {
            problem: "numLayersTooBig",
            valid: false,
        };
    }
    if (modelParameters.layerInfo.length < 1) {
        return {
            problem: "numLayersTooSmall",
            valid: false,
        };
    }
    for (let i = 0; i < modelParameters.layerInfo.length; i++) {
        let layerInfo = modelParameters.layerInfo[i];
        if (layerInfo.activationFunction === "Undef") {
            return {
                problem: "activationFunction",
                layer: i,
                valid: false,
            };
        } else if (layerInfo.numFilters < 1) {
            return {
                problem: "numFiltersTooSmall",
                layer: i,
                numFilters: layerInfo.numFilters,
                valid: false,
            };
        } else if (layerInfo.numFilters > 6) {
            return {
                problem: "numFiltersTooBig",
                layer: i,
                numFilters: layerInfo.numFilters,
                valid: false,
            };
        } else if (layerInfo.filterSize < 4) {
            return {
                problem: "filterSizeTooSmall",
                layer: i,
                filterSize: layerInfo.filterSize,
                valid: false,
            };
        } else if (layerInfo.filterSize > 6) {
            return {
                problem: "filterSizeTooBig",
                layer: i,
                filterSize: layerInfo.filterSize,
                valid: false,
            };
        }
    }
    return {
        valid: true,
    };
}
function getRelevantParamsCNN(modelParameters) {
    let relevantLayerInfo = new Array(modelParameters.layerInfo.length);
    for (let i = 0; i < relevantLayerInfo.length; i++) {
        let layerInfo = modelParameters.layerInfo[i];
        relevantLayerInfo[i] = {
            numFilters: layerInfo.numFilters,
            filterSize: layerInfo.filterSize,
            filterDepth: layerInfo.filterDepth,
            activationFunction: activation_function_mapper[layerInfo.activationFunction],
        };
    }
    let relevantParams = {
        networkType: modelParameters.networkType,
        dataset: dataset_mapper[modelParameters.dataset],
        layerInfo: relevantLayerInfo,
    };
    return relevantParams;
}

function processResponseCNN(response) {
    let trainedModelData = new Array(response.length);

    // loop through epochs
    for (let e = 0; e < trainedModelData.length; e++) {
        let respLayerHistory = response[e].layerHistory;
        let layerHistory = new Array(respLayerHistory.length);
        // loop through layers
        for (let l = 0; l < layerHistory.length; l++) {
            let respFilterWeightHistory = respLayerHistory[l].filterWeightHistory;
            let respActivationMapHistory = respLayerHistory[l].activationMapHistory;
            let filterWeightHistory = new Array(respFilterWeightHistory.length);
            let activationMapHistory = new Array(respActivationMapHistory.length);
            // loop through filters
            for (let f = 0; f < filterWeightHistory.length; f++) {
                filterWeightHistory[f] = respFilterWeightHistory[f].map(
                    (pseudoTensor) =>
                        new Tensor(
                            pseudoTensor.dims,
                            pseudoTensor.values.map((n) => Number(n))
                        )
                );
                activationMapHistory[f] = respActivationMapHistory[f].map(
                    (pseudoTensor) =>
                        new Tensor(
                            pseudoTensor.dims,
                            pseudoTensor.values.map((n) => Number(n))
                        )
                );
            }
            layerHistory[l] = {
                filterWeightHistory: filterWeightHistory,
                activationMapHistory: activationMapHistory,
            };
        }
        trainedModelData[e] = {
            layerHistory: layerHistory,
            accuracyHistory: response[e].accuracyHistory,
            imageURLs: response[e].imageURLs,
            predictions: response[e].predictions,
        };
    }
    return trainedModelData;
}

async function fetchModelDataCNN(modelParameters, setTrainedModelData, setLoadingStatus) {
    setLoadingStatus({ status: "isLoading", showWarning: false });
    // gathering relevant parameters from modelParameters to send to server
    let relevantParams = getRelevantParamsCNN(modelParameters);

    // build the request object
    let request = {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relevantParams),
    };

    // asynchronously process and await the server response
    let firstFetchResult = await fetch(BackendURL + "cnn", request)
        .then((resp) => resp.json())
        .then((resp) => {
            // processing response JSON into useful Tensor instances
            let trainedModelData = processResponseCNN(resp);
            console.log(trainedModelData[0]);

            // // start fetching image documents from the server
            let imagePromises = [];
            for (let e = 0; e < trainedModelData.length; e++) {
                for (let i = 0; i < trainedModelData[e].imageURLs.length; i++) {
                    let imageRequest = {
                        method: "POST",
                        mode: "cors",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ imageUrl: trainedModelData[e].imageURLs[i] }),
                    };
                    imagePromises.push(fetch(BackendURL + "datasets", imageRequest));
                }
            }

            return [trainedModelData, imagePromises];
        })
        .catch((err) => {
            console.log(err);
            setLoadingStatus({ status: "fail", showWarning: true });
        });

    let trainedModelData = firstFetchResult[0];
    let imagePromises = firstFetchResult[1];

    // after image documents have been retrieved, take their data and convert it to Blob
    let imageBlobs = await Promise.all(imagePromises)
        .then((responses) => {
            // blobify
            let blobs = responses.map((r) => r.blob());
            return blobs;
        })
        .catch(() => {
            setLoadingStatus({ status: "fail", showWarning: true });
        });

    // Because blobifying is asynchronous, wait for that to be done and then create real images out of the blobs.
    // Upon completion, update trainedModelData and call the state-setter
    await Promise.all(imageBlobs)
        .then((blobs) => {
            trainedModelData.images = blobs.map((b) => URL.createObjectURL(b));
            console.log(trainedModelData);
            setTrainedModelData(trainedModelData);
        })
        .catch(() => {
            setLoadingStatus({ status: "fail", showWarning: true });
        });
    setLoadingStatus({ status: "done", showWarning: false });
}

function addLayerButtonOnClickCNN(numLayers, modelParameters, setModelParameters, setShowLayerInfoBox, setSelectedLayer) {
    if (modelParameters.networkType === "Convolutional Neural Network" && numLayers >= 6) {
        return;
    }
    let temp = cloneModelParametersCNN(modelParameters);

    // RGB vs. Grayscale dataset
    let filterDepth = 0;
    if (temp.dataset === "MNIST") {
        filterDepth = 1;
    } else {
        filterDepth = 3;
    }
    if (temp.layerInfo.length > 0) {
        filterDepth = temp.layerInfo[temp.layerInfo.length - 1].numFilters;
    }
    let randomArray = new Array(4 * 4 * filterDepth);
    let weightTensor = new Tensor([4, 4, filterDepth], randomArray.fill(null));
    temp.layerInfo.push({
        numFilters: 1,
        filterSize: 4,
        filterDepth: filterDepth,
        activationFunction: "Undef",
        filterWeights: [weightTensor],
        activationMaps: ["N/A"],
        filterWeightHistories: [[]],
    });
    temp.animationProperties.layerAnimations.push(null);
    console.log("Current Temp: ", temp);
    setModelParameters(temp);
    setShowLayerInfoBox(true);
    setSelectedLayer(temp.layerInfo.length - 1);
}
function removeLayerButtonOnClickCNN(modelParameters, setModelParameters) {
    let temp = cloneModelParametersCNN(modelParameters);
    temp.layerInfo.pop();
    temp.animationProperties.layerAnimations.pop();
    console.log("Removed Layer Temp: ", temp);
    setModelParameters(temp);
}

function RandomArray(size, range) {
    let arr = new Array(size);
    for (let i = 0; i < size; i++) {
        arr[i] = Math.random() * (range[1] - range[0]) + range[0];
    }
    return arr;
}

/*
  Documentation:

  
  CNN FETCH
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  The format of the response JSON is like this:
  resp := [
    epoch := {
      layerHistory: [
        {
          filterWeightHistory: [
            [<Weight Tensor for Filter 0 at Time 0>, <Weight Tensor for Filter 0 at Time 1>, ...],
            [<Weight Tensor for Filter 1 at Time 0>, <Weight Tensor for Filter 1 at Time 1>, ...],
            [<Weight Tensor for Filter 2 at Time 0, <Weight Tensor for Filter 2 at Time 1>, ...],
            etc.
          ],
          activationMapHistory: [
            [<Activation Map for Filter 0 at Time 0>, <Activation Map for Filter 0 at Time 1>, ...],
            [<Activation Map for Filter 1 at Time 0>, <Activation Map for Filter 1 at Time 1>, ...],
            [<Activation Map for Filter 2 at Time 0>, <Activation Map for Filter 2 at Time 1>, ...],
            etc.
          ]
        }
      ],
      accuracyHistory: [
        { // time 0
          trainingAccuracy: ...,
          validationAccuracy: ...,
          testingAccuracy: ...
        },
        { // time 1
          ...
        },
        ...
      ],
      imageUrls: [<string>, <string>, ...]
    }
  ]
  */
