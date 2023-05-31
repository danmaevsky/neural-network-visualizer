import { useEffect, useRef } from "react";
import "./MLPLayerInfoBox.css";
import addNeuronButtonSvg from "../../../resources/addNeuronButton.svg";
import removeNeuronButtonSvg from "../../../resources/removeNeuronButton.svg";
import sigmoidSvg from "../../../resources/sigmoid.svg";
import tanhSvg from "../../../resources/tanh.svg";
import reluSvg from "../../../resources/relu.svg";
import leakyReluSvg from "../../../resources/leakyrelu.svg";
import eluSvg from "../../../resources/elu.svg";
import swishSvg from "../../../resources/swish.svg";

export function MLPLayerInfoBox(props) {
  const setShowLayerInfoBox = props.setShowLayerInfoBox;
  const selectedLayer = props.selectedLayer;
  const setSelectedLayer = props.setSelectedLayer;
  const modelParameters = props.modelParameters;
  const setModelParameters = props.setModelParameters;
  const isAnimating = props.isAnimating;
  // const [showOverflowWarning, setShowOverflowWarning] = useState(false);
  // const [showUnderflowWarning, setShowUnderflowWarning] = useState(false);
  // const setNeuronBoxProps = props.setNeuronInfoBoxProps;
  // // information parameters
  // const activationFunction = props.activationFunction;
  // const numInputs = props.numInputs;
  // const sigma = props.sigma;
  // const activationOutput = props.activationOutput;

  const ref = useRef(null);
  useEffect(() => {
    ref.current.focus();
  }, []);

  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowLayerInfoBox(false);
      setSelectedLayer(null);
    }
  };

  const addNeuronButtonOnClick = () => {
    // if (modelParameters.numNeuronsPerLayer[selectedLayer] >= 10) {
    //   setShowOverflowWarning(true);
    //   return;
    // }
    let temp = structuredClone(modelParameters);
    temp.numNeuronsPerLayer[selectedLayer] += 1;
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
  };

  const removeNeuronButtonOnClick = () => {
    // if (modelParameters.numNeuronsPerLayer[selectedLayer] <= 1) {
    //   setShowUnderflowWarning(true);
    //   return;
    // }
    let temp = structuredClone(modelParameters);
    temp.numNeuronsPerLayer[selectedLayer] -= 1;
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
  };

  // useEffect(() => {
  //   if (modelParameters.numNeuronsPerLayer[selectedLayer] <= 9) {
  //     setShowOverflowWarning(false);
  //   }
  //   if (modelParameters.numNeuronsPerLayer[selectedLayer] >= 2) {
  //     setShowUnderflowWarning(false);
  //   }
  // });

  let enableAddNeuronButton = modelParameters.numNeuronsPerLayer[selectedLayer] < 10 && modelParameters.preset === null && !isAnimating;
  let enableRemoveNeuronButton = modelParameters.numNeuronsPerLayer[selectedLayer] > 1 && modelParameters.preset === null && !isAnimating;
  let enableFunctionButtons = modelParameters.preset === null && !isAnimating;

  return (
    <div className="MLPLayerInfoBox" tabIndex="-1" ref={ref} onBlur={onClickOutside}>
      <h1 className="layerHeader">Layer</h1>
      <h1 className="propertiesHeader">Properties</h1>
      <div className="layerInfoBoxInfo">
        <div className="properties">
          <div className="numNeuronsText">
            <p>Neurons: </p>
            <p>{modelParameters.numNeuronsPerLayer[selectedLayer]}</p>
          </div>
          <div className="neuronButtons">
            <p className="neuronButtonsText">Add or Remove Neurons:</p>
            <div>
              <NumNeuronButton src={removeNeuronButtonSvg} onClick={removeNeuronButtonOnClick} isEnabled={enableRemoveNeuronButton} />
              <NumNeuronButton src={addNeuronButtonSvg} onClick={addNeuronButtonOnClick} isEnabled={enableAddNeuronButton} />
            </div>
            {/* {showOverflowWarning ? <OverflowWarningMessage onClick={() => setShowOverflowWarning(false)} /> : null}
            {showUnderflowWarning ? <UnderflowWarningMessage onClick={() => setShowUnderflowWarning(false)} /> : null} */}
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
  className = title === modelParameters.activationFunctions[selectedLayer] ? "selectedFunctionButton" : className;

  const onClick = () => {
    let temp = structuredClone(modelParameters);
    temp.activationFunctions[selectedLayer] = title;
    setModelParameters(temp);
    console.log(temp);
  };

  return <input type="image" className={className} src={icon} onClick={isEnabled ? onClick : null} alt="Activation Function Button" />;
}

function NumNeuronButton(props) {
  const onClick = props.onClick;
  const src = props.src;
  const isEnabled = props.isEnabled;
  const className = isEnabled ? "numNeuronsButton" : "disabledNumNeuronsButton";
  return <input type="image" className={className} src={src} onClick={isEnabled ? onClick : null} alt="Num Neuron Button" />;
}
