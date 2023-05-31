import { Neuron } from "./Neuron/Neuron";
import "./MLPLayer.css";
import React, { useEffect, useRef } from "react";

export const MLPLayer = React.memo(function MLPLayer(props) {
  // props for interactivity
  const layerId = props.layerId;
  const selectedLayerId = props.selectedLayerId;
  const setSelectedLayer = props.setSelectedLayer;
  const setShowLayerInfoBox = props.setShowLayerInfoBox;
  const setShowNeuronInfoBox = props.setShowNeuronInfoBox;
  const neuronInfoBoxProps = props.neuronInfoBoxProps;
  const setNeuronInfoBoxProps = props.setNeuronInfoBoxProps;
  // click functionality
  const selectedNeuron = props.selectedNeuron;
  const setSelectedNeuron = props.setSelectedNeuron;
  // shift-click functionality
  const leftSelectedNeuron = props.leftSelectedNeuron;
  const setLeftSelectedNeuron = props.setLeftSelectedNeuron;
  const rightSelectedNeuron = props.rightSelectedNeuron;
  const setRightSelectedNeuron = props.setRightSelectedNeuron;
  const setShowSynapseInfoBox = props.setShowSynapseInfoBox;

  // information that the layer needs to be created and to display
  const numNeurons = props.numNeurons;
  const activationFunction = props.activationFunction;
  const numInputs = props.numInputs;
  const allSigmas = props.allSigmas;
  const allActivationOutputs = props.allActivationOutputs;
  const animationStates = props.animationStates;

  // visual parameters
  const neuronHeight = props.neuronHeight;
  const neuronWidth = props.neuronWidth;
  const layerHeight = props.layerHeight;
  const layerWidth = props.layerWidth;
  const layerTopOffset = props.layerTopOffset;
  const layerLeftOffset = props.layerLeftOffset;
  const neuronVerticalSpacing = props.neuronVerticalSpacing;
  const neuronTopOffset = (layerHeight - (numNeurons - 1) * neuronVerticalSpacing) / 2 - neuronHeight / 2;
  const neuronLeftOffset = (layerWidth - neuronWidth) / 2;

  // useRef important for animation
  let wasPrevSelected = useRef(true); // true because we want the animation to play when first adding a layer too
  let prevNumNeurons = useRef(0); // when we add a layer, we only add 1 neuron. To ensure the conditional below fires, we make this 0
  useEffect(() => {
    prevNumNeurons.current = numNeurons;
    wasPrevSelected.current = selectedLayerId === layerId;
  });

  // selecting the layer to allow you to add neurons
  const layerOnClick = () => {
    setSelectedLayer(layerId);
    setShowLayerInfoBox(true);
  };

  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      //   setSelectedLayer(null);
    }
  };

  let neurons = new Array(numNeurons);
  for (let i = 0; i < numNeurons; i++) {
    let key = layerId === selectedLayerId && prevNumNeurons.current !== numNeurons ? Math.random() : `n${i}L${layerId}`;
    /* animation logic:
        "key" prop must change to be treated like a new HTML element with new animations, so if this is the selected layer then make key random.
        1. Check if this layer is the selected layer. If not, do not assign animation classes to the child neurons.
        2. If this is the selected layer, check to see if this was already selected. If it was, potentially play the animation depending on
            if numNeurons changed between renders. If this layer was newly selected, don't play the CSS SVG animations because then they'd
            play from every click
        3. If it was previously selected, check if the number of neurons increased or decreased.
            If increased, play popIn animation on the first neuron and slideDown animation on the rest.
            If decreased, just play slideUp animation on every neuron.
    */
    let popOrSlide = "";
    if (layerId === selectedLayerId) {
      if (wasPrevSelected.current) {
        if (numNeurons > prevNumNeurons.current) {
          if (i === 0) {
            popOrSlide = "popIn";
          } else {
            popOrSlide = "slideDown";
          }
        } else if (numNeurons < prevNumNeurons.current) {
          popOrSlide = "slideUp";
        }
      }
    }

    neurons[i] = (
      <Neuron
        key={key}
        id={key}
        layerId={layerId}
        neuronId={i}
        selectedNeuron={selectedNeuron}
        setSelectedNeuron={setSelectedNeuron}
        height={neuronHeight}
        width={neuronWidth}
        layerX={layerLeftOffset}
        x={neuronLeftOffset}
        y={neuronVerticalSpacing * i + neuronTopOffset}
        popOrSlide={popOrSlide}
        setSelectedLayer={setSelectedLayer}
        setShowNeuronInfoBox={setShowNeuronInfoBox}
        neuronInfoBoxProps={neuronInfoBoxProps}
        setNeuronInfoBoxProps={setNeuronInfoBoxProps}
        activationFunction={activationFunction}
        numInputs={numInputs}
        sigma={allSigmas[i]}
        activationOutput={allActivationOutputs[i]}
        animationState={animationStates[i]}
        leftSelectedNeuron={leftSelectedNeuron}
        rightSelectedNeuron={rightSelectedNeuron}
        setLeftSelectedNeuron={setLeftSelectedNeuron}
        setRightSelectedNeuron={setRightSelectedNeuron}
        setShowSynapseInfoBox={setShowSynapseInfoBox}
      ></Neuron>
    );
  }

  return (
    <g className={layerId === selectedLayerId ? "selectedLayer" : "mlpLayer"}>
      <svg
        width={layerWidth}
        height={layerHeight}
        x={layerLeftOffset}
        y={layerTopOffset}
        onClick={layerOnClick}
        tabIndex={-1}
        onBlur={(e) => onClickOutside(e)}
      >
        <rect width={layerWidth} height={layerHeight} fill={selectedLayerId === layerId ? "#cbcbcb" : "white"} rx={layerWidth * 0.1}></rect>
        {neurons}
      </svg>
    </g>
  );
});
