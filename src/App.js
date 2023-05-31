// import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
// import { Tensor } from "./Helpers";
// import useArray from "./hooks/useArray";
import { ControlBar } from "./components/ControlBar/ControlBar";
import { ModelViewPort } from "./components/ModelViewPort/ModelViewPort";
import { AnimationQueue, CreateCNNAnimation, CreateMLPAnimation } from "./Animation";
import { TutorialCards } from "./components/TutorialCards";
import { ParameterWarning } from "./components/ParameterWarning/ParameterWarning";
import { NetworkWarning } from "./components/NetworkWarning/NetworkWarning";
import { LoadingMessage } from "./components/LoadingMessage/LoadingMessage";
import { useToggle } from "./hooks/useToggle";

function App() {
    /* states that must be communicated between ControlBar and ModelViewPort must be stored here */
    // important logical states
    const [modelParameters, setModelParameters] = useState({
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
    const [animationQueue, setAnimationQueue] = useState(new AnimationQueue());
    // const [preset, setPreset] = useState(null);

    const [selectedLayer, setSelectedLayer] = useState(null);

    // to display certain things
    const [showTutorial, toggleShowTutorial] = useState(true);
    // this state had to be lifted up so that the NetworkInfoBar can use it too
    const [showLayerInfoBox, setShowLayerInfoBox] = useState(false);

    // show Sidebar after clicking on Hamburger menu
    const [showSideBar, toggleShowSideBar] = useToggle(false);

    /* states required for animation */
    const [playbackSpeed, setPlaybackSpeed] = useState("Average");

    // multilayer perceptron animation stuff will be within the modelParameters object
    // convolutional neural network animation will be within the modelParameters object

    // once we fetch from backend, update these states
    const [trainedModelData, setTrainedModelData] = useState({});
    const [displayedImageSrc, setDisplayedImageSrc] = useState(null);
    const [displayedPrediction, setDisplayedPrediction] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // test function and states for fetching data
    const [loadingStatus, setLoadingStatus] = useState({
        status: null,
        showWarning: false,
    });

    // validating modelParameters and displaying warning if not valid
    const [parameterWarning, setParameterWarning] = useState({
        status: null,
        showWarning: false,
    });

    useEffect(() => {
        if (modelParameters.networkType === "Multilayer Perceptron Network") {
            CreateMLPAnimation(
                animationQueue,
                modelParameters,
                setModelParameters,
                trainedModelData,
                setDisplayedImageSrc,
                setDisplayedPrediction,
                setIsAnimating,
                playbackSpeed
            );
        }
        if (modelParameters.networkType === "Convolutional Neural Network") {
            CreateCNNAnimation(animationQueue, modelParameters, setModelParameters, trainedModelData, setIsAnimating, playbackSpeed);
        }
        // animationQueue.animate();
    }, [trainedModelData]);

    return (
        <div className="App">
            <ControlBar
                modelParameters={modelParameters}
                setModelParameters={setModelParameters}
                setSelectedLayer={setSelectedLayer}
                setShowLayerInfoBox={setShowLayerInfoBox}
                setTrainedModelData={setTrainedModelData}
                setParameterWarning={setParameterWarning}
                showSideBar={showSideBar}
                toggleShowSideBar={toggleShowSideBar}
                toggleShowTutorial={toggleShowTutorial}
                isAnimating={isAnimating}
                setIsAnimating={setIsAnimating}
                animationQueue={animationQueue}
                setAnimationQueue={setAnimationQueue}
                setDisplayedImageSrc={setDisplayedImageSrc}
                setDisplayedPrediction={setDisplayedPrediction}
                setPlaybackSpeed={setPlaybackSpeed}
                setLoadingStatus={setLoadingStatus}
            ></ControlBar>
            <ModelViewPort
                displayedImageSrc={displayedImageSrc}
                displayedPrediction={displayedPrediction}
                modelParameters={modelParameters}
                setModelParameters={setModelParameters}
                selectedLayer={selectedLayer}
                setSelectedLayer={setSelectedLayer}
                showLayerInfoBox={showLayerInfoBox}
                setShowLayerInfoBox={setShowLayerInfoBox}
                animationQueue={null}
                isAnimating={isAnimating}
            />
            {showTutorial ? <TutorialCards toggleShowTutorial={toggleShowTutorial} /> : null}
            {parameterWarning.showWarning ? <ParameterWarning status={parameterWarning.status} setParameterWarning={setParameterWarning} /> : null}
            {loadingStatus.showWarning ? <NetworkWarning status={loadingStatus.status} setLoadingStatus={setLoadingStatus} /> : null}
            {loadingStatus.status === "isLoading" || loadingStatus.status === "done" ? (
                <LoadingMessage loadingStatus={loadingStatus} setLoadingStatus={setLoadingStatus} animationQueue={animationQueue} />
            ) : null}
        </div>
    );
}

export default App;
