import { useState, useEffect, useRef } from "react";
import "./NavBar.css";
import { Dropdown } from "./Dropdown/Dropdown";
import { SideBar } from "../../SideBar/SideBar";
import logo from "./logo.svg";
import { useToggle } from "../../../hooks/useToggle";
import { Tensor } from "../../../Helpers";
import { cloneModelParametersCNN, updateTensors } from "../../ModelViewPort/CNN/CNNHelpers";
import { AnimationQueue } from "../../../Animation";

export function NavBar(props) {
    const modelParameters = props.modelParameters;
    const setModelParameters = props.setModelParameters;
    const showSideBar = props.showSideBar;
    const toggleShowSideBar = props.toggleShowSideBar;
    const toggleShowTutorial = props.toggleShowTutorial;
    const isAnimating = props.isAnimating;
    const setIsAnimating = props.setIsAnimating;
    const animationQueue = props.animationQueue;
    const setAnimationQueue = props.setAnimationQueue;
    const setDisplayedPrediction = props.setDisplayedPrediction;
    const setDisplayedImageSrc = props.setDisplayedImageSrc;
    const setPlaybackSpeed = props.setPlaybackSpeed;

    const presetsDropdownItems = ["MNIST-MLP", "MNIST-CNN", "CIFAR-10-MLP", "CIFAR-10-CNN"];
    const [presetSelection, setPresetSelection] = useState(null);
    const [dropdownsEnabled, setDropdownsEnabled] = useState(true);
    const presetsOnSelect = (selection) => {
        if (selection === null) {
            setPresetSelection(null);
            setDropdownsEnabled(true);
            clearBoardOnClick();
            return;
        }
        if (selection === "MNIST-MLP") {
            PresetSelectMNIST_MLP(setModelParameters);
        } else if (selection === "CIFAR-10-MLP") {
            PresetSelectCIFAR_10_MLP(setModelParameters);
        } else if (selection === "MNIST-CNN") {
            PresetSelectMNIST_CNN(setModelParameters);
        } else if (selection === "CIFAR-10-CNN") {
            PresetSelectCIFAR_10_CNN(setModelParameters);
        }
        setPresetSelection(selection);
        setDropdownsEnabled(false);
        setDataSelection(null);
        setAlgoSelection(null);
        return;
    };

    const datasetsDropdownItems = ["MNIST", "CIFAR-10", "Playing Cards", "Gems"];
    const [datasetSelection, setDataSelection] = useState(null);
    const datasetsOnSelect = (selection) => {
        setDataSelection(selection);
        if (modelParameters.networkType === "Convolutional Neural Network") {
            let temp = cloneModelParametersCNN(modelParameters);
            temp.dataset = selection;
            if (temp.layerInfo.length > 0) {
                updateTensors(temp);
            }
            setModelParameters(temp);
            return;
        } else {
            let temp = structuredClone(modelParameters);
            temp.dataset = selection;
            setModelParameters(temp);
            return;
        }
    };

    const algoDropdownItems = ["Multilayer Perceptron Network", "Convolutional Neural Network"];
    const [algoSelection, setAlgoSelection] = useState(null);
    const algoOnSelect = (selection) => {
        setAlgoSelection(selection);
        // selecting MLP
        if (selection === "Multilayer Perceptron Network") {
            AlgoSelectMLP(modelParameters, setModelParameters);
            return;
        }

        // selecting CNN
        if (selection === "Convolutional Neural Network") {
            AlgoSelectCNN(modelParameters, setModelParameters);
            return;
        }

        // selecting null
        if (selection === null) {
            AlgoSelectNull(modelParameters, setModelParameters);
            return;
        }
    };

    const speedDropdownItems = ["Slow", "Average", "Fast"];
    const [speedSelection, setSpeedSelection] = useState("Average");
    const speedOnSelect = (selection) => {
        setSpeedSelection(selection);
        setPlaybackSpeed(selection);
    };

    const clearBoardOnClick = () => {
        setModelParameters({
            networkType: null,
            dataset: null,
            numNeuronsPerLayer: [],
            activationFunctions: [],
            layerDisplay: [],
            synapseDisplay: [],
            accuracies: {
                trainingAccuracy: "N/A",
                validationAccuracy: "N/A",
                testingAccuracy: "N/A",
            },
        });
        setIsAnimating(false);
        setDisplayedImageSrc(null);
        setDisplayedPrediction(null);

        animationQueue.isPaused = true;
        setAnimationQueue(new AnimationQueue());
        setPresetSelection(null);
        setDropdownsEnabled(true);
        setAlgoSelection(null);
        setDataSelection(null);
    };

    return (
        <div className="NavBar">
            <div className="navbarLeft">
                <Logo></Logo>
                <h1 className="appTitle">Neural Network Visualizer</h1>
            </div>
            <div className="buttonsAndDropdowns">
                <Dropdown
                    title="Presets"
                    menuItems={presetsDropdownItems}
                    selection={presetSelection}
                    onSelect={presetsOnSelect}
                    isEnabled={!isAnimating}
                    willGlow={true}
                ></Dropdown>
                <Dropdown
                    title="Datasets"
                    menuItems={datasetsDropdownItems}
                    selection={datasetSelection}
                    onSelect={datasetsOnSelect}
                    isEnabled={dropdownsEnabled && !isAnimating}
                ></Dropdown>
                <Dropdown
                    title="Algorithms"
                    menuItems={algoDropdownItems}
                    selection={algoSelection}
                    onSelect={algoOnSelect}
                    isEnabled={dropdownsEnabled && !isAnimating}
                ></Dropdown>
                <Dropdown
                    title="Speed"
                    menuItems={speedDropdownItems}
                    selection={speedSelection}
                    onSelect={speedOnSelect}
                    isEnabled={!isAnimating}
                ></Dropdown>
                <ClearBoardButton onClick={clearBoardOnClick}></ClearBoardButton>
            </div>
            <HamburgerButton
                toggleShowSideBar={toggleShowSideBar}
                toggleShowTutorial={toggleShowTutorial}
                onClick={() => toggleShowSideBar()}
                showSideBar={showSideBar}
            />
        </div>
    );
}

function Logo() {
    return <img className="navBarLogo" src={logo} alt="navBarLogo" />;
}

function HamburgerButton(props) {
    const showSideBar = props.showSideBar;
    const toggleShowSideBar = props.toggleShowSideBar;
    const toggleShowTutorial = props.toggleShowTutorial;
    const onClick = props.onClick;

    let sideBarRef = useRef(null);

    const onClickOutside = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            toggleShowSideBar(false);
            console.log("clicked outside sidebar");
        }
    };

    let className = showSideBar ? "hamburgerButtonOpen" : "hamburgerButton";
    return (
        <div
            tabIndex={-1}
            ref={sideBarRef}
            onBlur={(e) => {
                onClickOutside(e);
                sideBarRef.current.focus();
            }}
        >
            <svg className={className} onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="39" height="34" viewBox="0 0 39 34">
                <defs>
                    <clipPath id="clipPath">
                        <rect width="39" height="34" fill="none" />
                    </clipPath>
                </defs>
                <g id="Repeat_Grid_1" data-name="Repeat Grid 1" clipPath="url(#clipPath)">
                    <g transform="translate(-1634 -27)">
                        <g id="Rectangle_11" data-name="Rectangle 11" transform="translate(1634 27)" fill="#fff" stroke="#000" strokeWidth="1">
                            <rect width="39" height="8" stroke="none" />
                            <rect x="0.5" y="0.5" width="38" height="7" fill="none" />
                        </g>
                    </g>
                    <g transform="translate(-1634 -14)">
                        <g id="Rectangle_11-2" data-name="Rectangle 11" transform="translate(1634 27)" fill="#fff" stroke="#000" strokeWidth="1">
                            <rect width="39" height="8" stroke="none" />
                            <rect x="0.5" y="0.5" width="38" height="7" fill="none" />
                        </g>
                    </g>
                    <g transform="translate(-1634 -1)">
                        <g id="Rectangle_11-3" data-name="Rectangle 11" transform="translate(1634 27)" fill="#fff" stroke="#000" strokeWidth="1">
                            <rect width="39" height="8" stroke="none" />
                            <rect x="0.5" y="0.5" width="38" height="7" fill="none" />
                        </g>
                    </g>
                </g>
            </svg>
            {showSideBar ? <SideBar toggleShowSideBar={toggleShowSideBar} toggleShowTutorial={toggleShowTutorial} /> : null}
        </div>
    );
}

function ClearBoardButton(props) {
    const onClick = props.onClick;
    return (
        <div className="clearBoard" onClick={onClick}>
            <p>Reset Visualizer</p>
        </div>
    );
}

function AlgoSelectMLP(modelParameters, setModelParameters) {
    let temp = {
        networkType: "Multilayer Perceptron Network",
        dataset: modelParameters.dataset,
        numNeuronsPerLayer: [],
        activationFunctions: [],
        layerDisplay: [],
        synapseDisplay: [],
        accuracies: {
            trainingAccuracy: "N/A",
            validationAccuracy: "N/A",
            testingAccuracy: "N/A",
        },
        preset: null,
    };
    setModelParameters(temp);
    return;
}

function AlgoSelectCNN(modelParameters, setModelParameters) {
    let temp = {
        networkType: "Convolutional Neural Network",
        dataset: modelParameters.dataset,
        layerInfo: [],
        animationProperties: {
            layerAnimations: [],
            displayedImg: null,
        },
        accuracies: {
            trainingAccuracy: "N/A",
            validationAccuracy: "N/A",
            testingAccuracy: "N/A",
        },
        preset: null,
    };
    setModelParameters(temp);
    return;
}

function AlgoSelectNull(modelParameters, setModelParameters) {
    let temp = {
        networkType: null,
        dataset: modelParameters.dataset,
        numNeuronsPerLayer: [],
        activationFunctions: [],
        layerDisplay: [],
        synapseDisplay: [],
        accuracies: {
            trainingAccuracy: "N/A",
            validationAccuracy: "N/A",
            testingAccuracy: "N/A",
        },
        preset: null,
    };
    setModelParameters(temp);
    return;
}

function PresetSelectMNIST_MLP(setModelParameters) {
    let temp = {
        networkType: "Multilayer Perceptron Network",
        dataset: "MNIST",
        numNeuronsPerLayer: [10, 10, 10, 10, 10, 10, 10, 10],
        activationFunctions: ["Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU"],
        layerDisplay: new Array(10),
        synapseDisplay: new Array(10),
        accuracies: {
            trainingAccuracy: "N/A",
            validationAccuracy: "N/A",
            testingAccuracy: "N/A",
        },
    };
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
    temp.preset = "MNIST_MLP";
    setModelParameters(temp);
    return;
}

function PresetSelectMNIST_CNN(setModelParameters) {
    let temp = {
        networkType: "Convolutional Neural Network",
        dataset: "MNIST",
        layerInfo: [],
        animationProperties: {
            layerAnimations: [],
            displayedImg: null,
        },
        accuracies: {
            trainingAccuracy: "N/A",
            validationAccuracy: "N/A",
            testingAccuracy: "N/A",
        },
        preset: "MNIST-CNN",
    };
    let filterDepth = 1; // MNIST is grayscale
    let randomArray = new Array(4 * 4 * filterDepth);
    let weightTensor = new Tensor([4, 4, filterDepth], randomArray.fill(null));
    temp.layerInfo.push({
        numFilters: 6,
        filterSize: 4,
        filterDepth: filterDepth,
        activationFunction: "Leaky ReLU",
        filterWeights: [weightTensor, weightTensor, weightTensor, weightTensor, weightTensor, weightTensor],
        activationMaps: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
        filterWeightHistories: [[], [], [], [], [], []],
    });
    temp.animationProperties.layerAnimations.push(null);
    for (let i = 1; i < 6; i++) {
        filterDepth = temp.layerInfo[i - 1].numFilters;
        randomArray = new Array(4 * 4 * filterDepth);
        weightTensor = new Tensor([4, 4, filterDepth], randomArray.fill(null));
        temp.layerInfo.push({
            numFilters: 6,
            filterSize: 4,
            filterDepth: filterDepth,
            activationFunction: "Leaky ReLU",
            filterWeights: [weightTensor, weightTensor, weightTensor, weightTensor, weightTensor, weightTensor],
            activationMaps: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
            filterWeightHistories: [[], [], [], [], [], []],
        });
        temp.animationProperties.layerAnimations.push(null);
    }
    setModelParameters(temp);
    return;
}

function PresetSelectCIFAR_10_MLP(setModelParameters) {
    let temp = {
        networkType: "Multilayer Perceptron Network",
        dataset: "CIFAR-10",
        numNeuronsPerLayer: [10, 10, 10, 10, 10, 10, 10, 10],
        activationFunctions: ["Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU", "Leaky ReLU"],
        layerDisplay: new Array(10),
        synapseDisplay: new Array(10),
        accuracies: {
            trainingAccuracy: "N/A",
            validationAccuracy: "N/A",
            testingAccuracy: "N/A",
        },
    };
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
    temp.preset = "CIFAR-10-MLP";
    setModelParameters(temp);
    return;
}

function PresetSelectCIFAR_10_CNN(setModelParameters) {
    let temp = {
        networkType: "Convolutional Neural Network",
        dataset: "CIFAR-10",
        layerInfo: [],
        animationProperties: {
            layerAnimations: [],
            displayedImg: null,
        },
        accuracies: {
            trainingAccuracy: "N/A",
            validationAccuracy: "N/A",
            testingAccuracy: "N/A",
        },
        preset: "CIFAR-10-CNN",
    };
    let filterDepth = 3; // MNIST is grayscale
    let randomArray = new Array(4 * 4 * filterDepth);
    let weightTensor = new Tensor([4, 4, filterDepth], randomArray.fill(null));
    temp.layerInfo.push({
        numFilters: 6,
        filterSize: 4,
        filterDepth: filterDepth,
        activationFunction: "Leaky ReLU",
        filterWeights: [weightTensor, weightTensor, weightTensor, weightTensor, weightTensor, weightTensor],
        activationMaps: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
        filterWeightHistories: [[], [], [], [], [], []],
    });
    temp.animationProperties.layerAnimations.push(null);
    for (let i = 1; i < 6; i++) {
        filterDepth = temp.layerInfo[i - 1].numFilters;
        randomArray = new Array(4 * 4 * filterDepth);
        weightTensor = new Tensor([4, 4, filterDepth], randomArray.fill(null));
        temp.layerInfo.push({
            numFilters: 6,
            filterSize: 4,
            filterDepth: filterDepth,
            activationFunction: "Leaky ReLU",
            filterWeights: [weightTensor, weightTensor, weightTensor, weightTensor, weightTensor, weightTensor],
            activationMaps: ["N/A", "N/A", "N/A", "N/A", "N/A", "N/A"],
            filterWeightHistories: [[], [], [], [], [], []],
        });
        temp.animationProperties.layerAnimations.push(null);
    }
    setModelParameters(temp);
    return;
}
