import { useEffect, useRef } from "react";
import "./CNNLayerInfoBox.css";
import { cloneModelParametersCNN, updateTensors } from "../CNNHelpers";
import sigmoidSvg from "../../../../resources/sigmoid.svg";
import tanhSvg from "../../../../resources/tanh.svg";
import reluSvg from "../../../../resources/relu.svg";
import leakyReluSvg from "../../../../resources/leakyrelu.svg";
import eluSvg from "../../../../resources/elu.svg";
import swishSvg from "../../../../resources/swish.svg";
import addFilterButtonSvg from "./addFilterButton.svg";
import removeFilterButtonSvg from "./removeFilterButton.svg";

export function CNNLayerInfoBox(props) {
  const setShowLayerInfoBox = props.setShowLayerInfoBox;
  const selectedLayer = props.selectedLayer;
  const setSelectedLayer = props.setSelectedLayer;
  const modelParameters = props.modelParameters;
  const setModelParameters = props.setModelParameters;
  const isAnimating = props.isAnimating;

  // grant focus to the InfoBox upon creation
  const ref = useRef(null);
  useEffect(() => {
    ref.current.focus();
  }, []);

  // close InfoBox if clicked outside
  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowLayerInfoBox(false);
      setSelectedLayer(null);
    }
  };

  const addFilterButtonOnClick = () => {
    let temp = cloneModelParametersCNN(modelParameters);
    temp.layerInfo[selectedLayer].numFilters = temp.layerInfo[selectedLayer].numFilters + 1;
    updateTensors(temp);
    setModelParameters(temp);
  };

  const removeFilterButtonOnClick = () => {
    let temp = cloneModelParametersCNN(modelParameters);
    temp.layerInfo[selectedLayer].numFilters = temp.layerInfo[selectedLayer].numFilters - 1;
    updateTensors(temp);
    setModelParameters(temp);
  };

  const increaseFilterSizeButtonOnClick = () => {
    let temp = cloneModelParametersCNN(modelParameters);
    temp.layerInfo[selectedLayer].filterSize = temp.layerInfo[selectedLayer].filterSize + 1;
    updateTensors(temp);
    setModelParameters(temp);
  };

  const decreaseFilterSizeButtonOnClick = () => {
    let temp = cloneModelParametersCNN(modelParameters);
    temp.layerInfo[selectedLayer].filterSize = temp.layerInfo[selectedLayer].filterSize - 1;
    updateTensors(temp);
    setModelParameters(temp);
  };

  // filterSize buttons
  let enableIncreaseFilterSizeButton = modelParameters.layerInfo[selectedLayer].filterSize < 6 && modelParameters.preset === null && !isAnimating;
  let enableDecreaseFilterSizeButton = modelParameters.layerInfo[selectedLayer].filterSize > 4 && modelParameters.preset === null && !isAnimating;

  // numFilter buttons
  let enableAddFilterButton = modelParameters.layerInfo[selectedLayer].numFilters < 6 && modelParameters.preset === null && !isAnimating;
  let enableRemoveFilterButton = modelParameters.layerInfo[selectedLayer].numFilters > 1 && modelParameters.preset === null && !isAnimating;
  let enableFunctionButtons = modelParameters.preset === null && !isAnimating;

  return (
    <div className="CNNLayerInfoBox" tabIndex="-1" ref={ref} onBlur={onClickOutside}>
      <h1 className="layerHeader">Layer</h1>
      <h1 className="propertiesHeader">Properties</h1>
      <div className="layerInfoBoxInfo">
        <div className="properties">
          <div className="numFiltersText">
            <p>Filters: </p>
            <p>{modelParameters.layerInfo[selectedLayer].numFilters}</p>
          </div>
          <div className="filterSizeProperty">
            <p>Filter Size: </p>
          </div>
          <div className="filterSizeText">
            <DecreaseFilterSizeButton onClick={decreaseFilterSizeButtonOnClick} isEnabled={enableDecreaseFilterSizeButton} />
            <p>{modelParameters.layerInfo[selectedLayer].filterSize}</p>
            <IncreaseFilterSizeButton onClick={increaseFilterSizeButtonOnClick} isEnabled={enableIncreaseFilterSizeButton} />
          </div>
          <div className="filterButtons">
            <p className="filterButtonsText">Add or Remove Filters:</p>
            <div>
              <RemoveFilterButton onClick={removeFilterButtonOnClick} isEnabled={enableRemoveFilterButton}></RemoveFilterButton>
              <AddFilterButton onClick={addFilterButtonOnClick} isEnabled={enableAddFilterButton}></AddFilterButton>
            </div>
          </div>
        </div>
      </div>
      <div className="activationFunctions">
        <p>Activation Function: </p>
        <div className="functionButtonsRow">
          <ActivationFunctionButton
            modelParameters={modelParameters}
            setModelParameters={setModelParameters}
            selectedLayer={selectedLayer}
            title="Sigmoid"
            icon={sigmoidSvg}
            isEnabled={enableFunctionButtons}
          ></ActivationFunctionButton>
          <ActivationFunctionButton
            modelParameters={modelParameters}
            setModelParameters={setModelParameters}
            selectedLayer={selectedLayer}
            title="Tanh"
            icon={tanhSvg}
            isEnabled={enableFunctionButtons}
          ></ActivationFunctionButton>
        </div>
        <div className="functionButtonsRow">
          <ActivationFunctionButton
            modelParameters={modelParameters}
            setModelParameters={setModelParameters}
            selectedLayer={selectedLayer}
            title="ReLU"
            icon={reluSvg}
            isEnabled={enableFunctionButtons}
          ></ActivationFunctionButton>
          <ActivationFunctionButton
            modelParameters={modelParameters}
            setModelParameters={setModelParameters}
            selectedLayer={selectedLayer}
            title="Leaky ReLU"
            icon={leakyReluSvg}
            isEnabled={enableFunctionButtons}
          ></ActivationFunctionButton>
        </div>
        <div className="functionButtonsRow">
          <ActivationFunctionButton
            modelParameters={modelParameters}
            setModelParameters={setModelParameters}
            selectedLayer={selectedLayer}
            title="ELU"
            icon={eluSvg}
            isEnabled={enableFunctionButtons}
          ></ActivationFunctionButton>
          <ActivationFunctionButton
            modelParameters={modelParameters}
            setModelParameters={setModelParameters}
            selectedLayer={selectedLayer}
            title="Swish"
            icon={swishSvg}
            isEnabled={enableFunctionButtons}
          ></ActivationFunctionButton>
        </div>
      </div>
    </div>
  );
}

function ActivationFunctionButton(props) {
  const modelParameters = props.modelParameters;
  const setModelParameters = props.setModelParameters;
  const selectedLayer = props.selectedLayer;
  const title = props.title;
  const icon = props.icon;
  const isEnabled = props.isEnabled;

  let className = isEnabled ? "functionButton" : "disabledFunctionButton";
  className = title === modelParameters.layerInfo[selectedLayer].activationFunction ? "selectedFunctionButton" : className;

  const onClick = () => {
    let temp = cloneModelParametersCNN(modelParameters);
    temp.layerInfo[selectedLayer].activationFunction = title;
    setModelParameters(temp);
    console.log(temp);
  };

  return <input type="image" className={className} src={icon} onClick={isEnabled ? onClick : null} alt="Activation Function Button" />;
}

function DecreaseFilterSizeButton(props) {
  const onClick = props.onClick;
  const isEnabled = props.isEnabled;
  const className = isEnabled ? "filterSizeButton" : " disabledFilterSizeButton";
  return (
    <svg className={className} width="7.277" height="12.204" viewBox="0 0 7.277 12.204" onClick={isEnabled ? onClick : null}>
      <path
        id="Icon_ionic-md-arrow-dropdown"
        data-name="Icon ionic-md-arrow-dropdown"
        d="M9,13.5l5.78,6.894L20.56,13.5Z"
        transform="translate(20.627 -8.678) rotate(90)"
        fill="#fff"
        stroke="#303030"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function IncreaseFilterSizeButton(props) {
  const onClick = props.onClick;
  const isEnabled = props.isEnabled;
  const className = isEnabled ? "filterSizeButton" : " disabledFilterSizeButton";
  return (
    <svg className={className} width="7.277" height="12.204" viewBox="0 0 7.277 12.204" onClick={isEnabled ? onClick : null}>
      <path
        id="Icon_ionic-md-arrow-dropdown"
        data-name="Icon ionic-md-arrow-dropdown"
        d="M9,13.5l5.78,6.894L20.56,13.5Z"
        transform="translate(-13.35 20.882) rotate(-90)"
        fill="#fff"
        stroke="#303030"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function RemoveFilterButton(props) {
  const onClick = props.onClick;
  const isEnabled = props.isEnabled;
  const className = isEnabled ? "editNumFiltersButton" : "disabledEditNumFiltersButton";
  return <input type="image" className={className} src={removeFilterButtonSvg} onClick={isEnabled ? onClick : null} alt="Remove Filter Button" />;
}

function AddFilterButton(props) {
  const onClick = props.onClick;
  const isEnabled = props.isEnabled;
  const className = isEnabled ? "editNumFiltersButton" : "disabledEditNumFiltersButton";
  return <input type="image" className={className} src={addFilterButtonSvg} onClick={isEnabled ? onClick : null} alt="Add Filter Button" />;
}
