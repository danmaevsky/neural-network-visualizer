import React, { useEffect, useRef } from "react";
import "./Synapse.css";

export const Synapse = React.memo(function Synapse(props) {
  const x1 = props.x1;
  const y1 = props.y1;
  const x2 = props.x2;
  const y2 = props.y2;
  const animationState = props.animationState;

  // important for shift-click functionality
  const leftNeuronId = props.leftNeuronId;
  const rightNeuronId = props.rightNeuronId;
  const leftLayerId = props.leftLayerId;
  const rightLayerId = props.rightLayerId;
  const leftSelectedNeuron = props.leftSelectedNeuron;
  const rightSelectedNeuron = props.rightSelectedNeuron;
  const setSynapseInfoBoxProps = props.setSynapseInfoBoxProps;

  const leftOutput = props.leftOutput;
  const currentWeight = props.currentWeight;
  const rightInput = props.rightInput;
  const weightHistory = props.weightHistory;
  // useRef necessary to avoid endless re-renders
  const previousWeight = useRef(currentWeight);
  const wasPreviousSelected = useRef(false);

  // console.log(`Synapse Rendered: LL=${leftLayerId} LN=${leftNeuronId} RL=${rightLayerId} RN=${rightNeuronId}`);

  // for updating the SynapseInfoBox with the correct values in case this synapse is selected
  useEffect(() => {
    const isSelectedSynapse =
      leftSelectedNeuron.neuronId === leftNeuronId &&
      leftSelectedNeuron.layerId === leftLayerId &&
      rightSelectedNeuron.neuronId === rightNeuronId &&
      rightSelectedNeuron.layerId === rightLayerId;

    if (!isSelectedSynapse) {
      return;
    }

    if (isSelectedSynapse && previousWeight.current !== currentWeight) {
      // InfoBoxProps
      let synapseInfoBoxProps = {
        leftOutput: leftOutput,
        currentWeight: currentWeight,
        rightInput: rightInput,
        weightHistory: weightHistory,
      };
      setSynapseInfoBoxProps(synapseInfoBoxProps);
      previousWeight.current = currentWeight;
      wasPreviousSelected.current = true;
      return;
    } else if (isSelectedSynapse && !wasPreviousSelected.current) {
      // InfoBoxProps
      let synapseInfoBoxProps = {
        leftOutput: leftOutput,
        currentWeight: currentWeight,
        rightInput: rightInput,
        weightHistory: weightHistory,
      };
      setSynapseInfoBoxProps(synapseInfoBoxProps);
      previousWeight.current = currentWeight;
      wasPreviousSelected.current = true;
    } else {
      wasPreviousSelected.current = false;
    }
  });

  const isSelectedClassName =
    leftSelectedNeuron.neuronId === leftNeuronId &&
    leftSelectedNeuron.layerId === leftLayerId &&
    rightSelectedNeuron.neuronId === rightNeuronId &&
    rightSelectedNeuron.layerId === rightLayerId
      ? "isShiftSelected"
      : "";

  return (
    <g id={animationState} className={`synapse_${animationState} ${isSelectedClassName}`}>
      <line className="outerLine" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.5vh" stroke="#606060" />
      <line className="middleLine" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.4vh" stroke="#f0f0f0" />
      <line className="innerLine" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.2vh" stroke="#ffffff" />
    </g>
  );
}, areEqual);

function areEqual(previousProps, nextProps) {
  let isEqual = true;
  for (const property in previousProps) {
    // this is a big performance booster: without this, react will just do a shallow comparison of references
    // and end up re-rendering EVERY synapse every time
    if (property === "weightHistory") {
      isEqual = isEqual && arraysAreEqual(previousProps.weightHistory, nextProps.weightHistory);
    } else {
      isEqual = isEqual && previousProps[property] === nextProps[property];
    }
  }
  return isEqual;
}

function arraysAreEqual(A, B) {
  if (A === B) {
    return true;
  }
  if ((A === null && B !== null) || (B === null && A !== null)) {
    return false;
  }
  if (A.length !== B.length) {
    return false;
  } else {
    for (let i = 0; i < A.length; i++) {
      if (A[i] !== B[i]) {
        return false;
      }
    }
    return true;
  }
}
