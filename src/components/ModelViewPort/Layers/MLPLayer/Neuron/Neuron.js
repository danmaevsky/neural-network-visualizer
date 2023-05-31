import neuronIcon from "./Test.svg";
import React, { useEffect, useRef } from "react";
import "./Neuron.css";

export const Neuron = React.memo(function Neuron(props) {
  // visual parameters
  const id = props.id;
  const layerId = props.layerId;
  const neuronId = props.neuronId;
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const popOrSlide = props.popOrSlide;
  const selectCircleRatio = 1.4;

  // interactivity
  const setSelectedLayer = props.setSelectedLayer;
  const selectedNeuron = props.selectedNeuron;
  const setSelectedNeuron = props.setSelectedNeuron;

  const leftSelectedNeuron = props.leftSelectedNeuron;
  const setLeftSelectedNeuron = props.setLeftSelectedNeuron;

  const rightSelectedNeuron = props.rightSelectedNeuron;
  const setRightSelectedNeuron = props.setRightSelectedNeuron;
  const setShowSynapseInfoBox = props.setShowSynapseInfoBox;

  const setShowNeuronInfoBox = props.setShowNeuronInfoBox;
  const neuronInfoBoxProps = props.neuronInfoBoxProps;
  const setNeuronInfoBoxProps = props.setNeuronInfoBoxProps;
  const activationFunction = props.activationFunction;
  const numInputs = props.numInputs;
  const sigma = props.sigma;
  const activationOutput = props.activationOutput;
  const animationState = props.animationState;

  let isSelected = selectedNeuron.neuronId === neuronId && selectedNeuron.layerId === layerId;
  let isShiftSelected = leftSelectedNeuron.neuronId === neuronId && leftSelectedNeuron.layerId === layerId;
  isShiftSelected = isShiftSelected || (rightSelectedNeuron.neuronId === neuronId && rightSelectedNeuron.layerId === layerId);

  const previousSigma = useRef(sigma);

  const handleClick = (e) => {
    if (e.shiftKey) {
      handleShiftClick();
      e.stopPropagation();
      return;
    }
    let temp = {
      neuronId: id,
      activationFunction: activationFunction,
      numInputs: numInputs,
      sigma: sigma,
      activationOutput: activationOutput,
    };
    setShowNeuronInfoBox(true);
    setNeuronInfoBoxProps(temp);
    setSelectedLayer(null);
    setSelectedNeuron({
      neuronId: neuronId,
      layerId: layerId,
    });

    setLeftSelectedNeuron({
      neuronId: null,
      layerId: null,
    });
    setRightSelectedNeuron({
      neuronId: null,
      layerId: null,
    });

    e.stopPropagation();
  };

  const handleShiftClick = () => {
    // selecting left neuron
    if (leftSelectedNeuron.neuronId === null) {
      setLeftSelectedNeuron({
        neuronId: neuronId,
        layerId: layerId,
      });
      setRightSelectedNeuron({
        neuronId: null,
        layerId: null,
      });
      setShowSynapseInfoBox(false);
    } else {
      // either selecting right neuron or performing correct behavior
      if (layerId === leftSelectedNeuron.layerId + 1) {
        setRightSelectedNeuron({
          neuronId: neuronId,
          layerId: layerId,
        });
        setShowSynapseInfoBox(true);
      } else if (layerId < leftSelectedNeuron.layerId + 1) {
        setLeftSelectedNeuron({
          neuronId: neuronId,
          layerId: layerId,
        });
        setRightSelectedNeuron({
          neuronId: null,
          layerId: null,
        });
        setShowSynapseInfoBox(false);
      } else {
        setLeftSelectedNeuron({
          neuronId: null,
          layerId: null,
        });
        setRightSelectedNeuron({
          neuronId: null,
          layerId: null,
        });
        setShowSynapseInfoBox(false);
      }
    }
    // set the regularly-selected neuron to null (because these are shift-selected)
    setSelectedNeuron({
      neuronId: null,
      layerId: null,
    });
  };

  useEffect(() => {
    if (neuronId === selectedNeuron.neuronId && layerId === selectedNeuron.layerId && previousSigma.current !== sigma) {
      let temp = {
        neuronId: id,
        activationFunction: activationFunction,
        numInputs: numInputs,
        sigma: sigma,
        activationOutput: activationOutput,
      };
      setNeuronInfoBoxProps(temp);
    }
  }, [sigma]);

  const className = `neuron ${popOrSlide} ${isSelected ? "isSelected" : ""} ${isShiftSelected ? "isShiftSelected" : ""} ${animationState}`;

  return (
    <g className={className}>
      <svg onClick={handleClick} xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 83 83" width={width} height={height} x={x} y={y}>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <circle className="cls-1" cx="40.07" cy="40.07" r="39.06" />
            <path
              className="cls-2"
              d="M52.29,51.14c6.55,4,6.47,9.08,9.67,9.09,5.81,0,14.6-16.81,10.53-32-3.76-14-16.72-19.81-17.62-20.2C52.3,7,43.35,3.52,33.39,7.09S15.17,20.24,17.05,24.71c1.57,3.73,8.93.84,13.67,6.26,4.45,5.08.52,10.52,4.81,15S44.74,46.56,52.29,51.14Z"
            />
            <path
              className="cls-3"
              d="M47.16,24.43C40.44,19,32.69,21.58,32.09,19.12S38.9,10.79,47,10.65c9.14-.17,17.66,6.82,20,15.06,1.65,5.71.7,13.24-2.42,14.34-2.64.93-6.39-2.84-9.83-6.3C49.93,28.85,50.48,27.12,47.16,24.43Z"
            />
          </g>
        </g>
      </svg>
      {isSelected ? <NeuronSelectCircle height={height} width={width} x={x} y={y} circleRatio={selectCircleRatio} /> : null}
      {isShiftSelected ? <NeuronShiftSelectCircle height={height} width={width} x={x} y={y} circleRatio={selectCircleRatio} /> : null}
    </g>
  );
});

function NeuronSelectCircle(props) {
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const circleRatio = props.circleRatio;

  return (
    <svg
      viewBox="0 0 100 100"
      width={width * circleRatio}
      height={height * circleRatio}
      x={x - (width * (circleRatio - 1)) / 2}
      y={y - (height * (circleRatio - 1)) / 2}
    >
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="0" stopColor="#ff0"></stop>
          <stop offset=".5" stopColor="#f0f"></stop>
          <stop offset="1" stopColor="#ff0"></stop>
        </linearGradient>
      </defs>
      <circle className="neuronSelectCircle" cx="50" cy="50" r="45" fill="none" stroke="url(#myGradient)" />
    </svg>
  );
}

function NeuronShiftSelectCircle(props) {
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const circleRatio = props.circleRatio;

  return (
    <svg
      viewBox="0 0 100 100"
      width={width * circleRatio}
      height={height * circleRatio}
      x={x - (width * (circleRatio - 1)) / 2}
      y={y - (height * (circleRatio - 1)) / 2}
    >
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="0" stopColor="#5fcafe"></stop>
          <stop offset=".5" stopColor="#fff"></stop>
          <stop offset="1" stopColor="#5fcafe"></stop>
        </linearGradient>
      </defs>
      <circle className="neuronSelectCircle" cx="50" cy="50" r="45" fill="none" stroke="url(#myGradient)" />
    </svg>
  );
}
