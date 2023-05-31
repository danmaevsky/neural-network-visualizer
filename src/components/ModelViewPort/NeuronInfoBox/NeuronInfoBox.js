import { useEffect, useRef } from "react";
import "./NeuronInfoBox.css";
// import neuronIcon from "../Layers/MLPLayer/Neuron/Neuron.svg";
// import sigmaIcon from "./Sigma.svg";

export function NeuronInfoBox(props) {
  const setShowNeuronInfoBox = props.setShowNeuronInfoBox;
  const setNeuronInfoBoxProps = props.setNeuronInfoBoxProps;
  const selectedNeuron = props.selectedNeuron;
  const setSelectedNeuron = props.setSelectedNeuron;

  // visual parameters and computations
  const height = props.height;
  const width = props.width;
  const layerSpacing = props.layerSpacing;
  const layerHeight = props.layerHeight;
  const layerLeftOffset = props.layerLeftOffset;
  const neuronHeight = props.neuronHeight;
  const neuronWidth = neuronHeight;
  const neuronVerticalSpacing = props.neuronVerticalSpacing;
  const modelParameters = props.modelParameters;

  let numNeurons = modelParameters.numNeuronsPerLayer[selectedNeuron.layerId];
  let neuronTopOffset = (layerHeight - (numNeurons - 1) * neuronVerticalSpacing) / 2;
  let renderAbove = selectedNeuron.neuronId > numNeurons / 2 - 1;

  // information parameters
  const activationFunction = props.activationFunction;
  const numInputs = props.numInputs;
  const sigma = props.sigma;
  const activationOutput = props.activationOutput;

  // Bring focus here upon render
  const ref = useRef(null);
  useEffect(() => {
    ref.current.focus();
  }, []);

  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowNeuronInfoBox(false);
      setNeuronInfoBoxProps({});
      setSelectedNeuron({
        neuronId: null,
        layerId: null,
      });
    }
  };

  return (
    <g className="neuronInfoBox">
      <svg
        viewBox="-1 0 82 120"
        tabIndex="-1"
        ref={ref}
        onBlur={onClickOutside}
        height={height}
        width={width}
        x={layerLeftOffset + layerSpacing * selectedNeuron.layerId + neuronWidth * 1.8}
        y={neuronTopOffset + neuronVerticalSpacing * selectedNeuron.neuronId + (renderAbove ? -neuronHeight * 5 : 0)}
      >
        <rect width="80" height="120" rx="2" fill="white" stroke="black" strokeWidth="0.5" x="0" y="0"></rect>
        <text className="neuronInfoBoxHeading" textAnchor="middle" fontSize="8" x="40" y="13">
          Neuron Info
        </text>
        <line x1="20" x2="60" y1="17" y2="17" strokeWidth="0.6"></line>
        <g>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="37">
            Activation
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="44">
            Function:
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="75" y="40">
            {activationFunction}
          </text>
        </g>
        <g>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="60">
            Inputs:
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="75" y="60">
            {numInputs}
          </text>
        </g>
        <g>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="80">
            Sum of Inputs:
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="75" y="80">
            {sigma}
          </text>
        </g>
        <g>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="97">
            Activation
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="104">
            Output (Z):
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="75" y="100">
            {activationOutput}
          </text>
        </g>
      </svg>
    </g>
    // <div className="neuronInfoBox" tabIndex="-1" ref={ref} onBlur={onClickOutside}>
    //   <h1 className="neuronHeader">Neuron Info</h1>
    //   <img src={neuronIcon} />
    //   <div className="neuronInfoBoxInfo">
    //     <div className="infoLeft">
    //       <p>Activation Function:</p>
    //       <p>Inputs:</p>
    //       <p>Sum of Inputs (Σ):</p>
    //       <p>Activation Output:</p>
    //     </div>
    //     <div className="infoRight">
    //       <p>{activationFunction}</p>
    //       <p>{numInputs}</p>
    //       <p>{sigma}</p>
    //       <p>{activationOutput}</p>
    //     </div>
    //   </div>
    // </div>
  );
}
