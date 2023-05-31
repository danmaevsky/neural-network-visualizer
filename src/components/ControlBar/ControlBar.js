import { NavBar } from "./NavBar/NavBar";
import { NetworkInfoBar } from "./NetworkInfoBar/NetworkInfoBar";
import "./ControlBar.css";

export function ControlBar(props) {
  const modelParameters = props.modelParameters;
  const setModelParameters = props.setModelParameters;
  const setSelectedLayer = props.setSelectedLayer;
  const setShowLayerInfoBox = props.setShowLayerInfoBox;
  const setTrainedModelData = props.setTrainedModelData;
  const setParameterWarning = props.setParameterWarning;
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

  // network stuff
  const setLoadingStatus = props.setLoadingStatus;

  return (
    <div className="controlBar">
      <NavBar
        modelParameters={modelParameters}
        setModelParameters={setModelParameters}
        showSideBar={showSideBar}
        toggleShowSideBar={toggleShowSideBar}
        toggleShowTutorial={toggleShowTutorial}
        setIsAnimating={setIsAnimating}
        animationQueue={animationQueue}
        isAnimating={isAnimating}
        setAnimationQueue={setAnimationQueue}
        setDisplayedImageSrc={setDisplayedImageSrc}
        setDisplayedPrediction={setDisplayedPrediction}
        setPlaybackSpeed={setPlaybackSpeed}
      ></NavBar>
      <NetworkInfoBar
        modelParameters={modelParameters}
        setModelParameters={setModelParameters}
        setSelectedLayer={setSelectedLayer}
        setShowLayerInfoBox={setShowLayerInfoBox}
        setTrainedModelData={setTrainedModelData}
        setParameterWarning={setParameterWarning}
        isAnimating={isAnimating}
        animationQueue={animationQueue}
        setLoadingStatus={setLoadingStatus}
      ></NetworkInfoBar>
    </div>
  );
}
