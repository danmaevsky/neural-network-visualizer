import { Synapse } from "./Synapse/Synapse";

export function SynapseLayer(props) {
  // visual parameters
  const neuronHeight = props.neuronHeight;
  const neuronWidth = props.neuronWidth;
  const layerHeight = props.layerHeight;
  const layerLeftOffset = props.layerLeftOffset;
  const layerSpacing = props.layerSpacing;
  const neuronVerticalSpacing = props.neuronVerticalSpacing;

  const numNeuronsLeft = props.numNeuronsLeft;
  const numNeuronsRight = props.numNeuronsRight;

  const neuronTopOffsetLeft = (layerHeight - (numNeuronsLeft - 1) * neuronVerticalSpacing) / 2 - neuronHeight / 2;
  const neuronTopOffsetRight = (layerHeight - (numNeuronsRight - 1) * neuronVerticalSpacing) / 2 - neuronHeight / 2;

  // animation
  const animationStates = props.animationStates;
  const leftOutputs = props.leftOutputs;
  const rightInputs = props.rightInputs;
  const currentWeights = props.currentWeights;
  const weightHistories = props.weightHistories;

  // shift-clicking parameters
  const leftLayerId = props.leftLayerId;
  const rightLayerId = props.rightLayerId;
  const leftSelectedNeuron = props.leftSelectedNeuron;
  const rightSelectedNeuron = props.rightSelectedNeuron;
  const setSynapseInfoBoxProps = props.setSynapseInfoBoxProps;

  let synapses = [];
  let activatedSynapses = [];
  let synapseIndex = 0;
  for (let i = 0; i < numNeuronsLeft; i++) {
    for (let j = 0; j < numNeuronsRight; j++) {
      let isSelectedSynapse =
        i === leftSelectedNeuron.neuronId &&
        leftLayerId === leftSelectedNeuron.layerId &&
        j === rightSelectedNeuron.neuronId &&
        rightLayerId === rightSelectedNeuron.layerId;
      let bringSynapseToFront =
        animationStates[synapseIndex] === "animate--activate" || animationStates[synapseIndex] === "animate--deactive" || isSelectedSynapse;
      if (!bringSynapseToFront) {
        synapses.push(
          <Synapse
            x1={layerLeftOffset + neuronWidth * 0.91}
            x2={layerLeftOffset + layerSpacing + neuronWidth * 0.91}
            y1={neuronTopOffsetLeft + neuronVerticalSpacing * i + neuronHeight * 1.27}
            y2={neuronTopOffsetRight + neuronVerticalSpacing * j + neuronHeight * 1.27}
            leftNeuronId={i}
            rightNeuronId={j}
            leftLayerId={leftLayerId}
            rightLayerId={rightLayerId}
            leftSelectedNeuron={leftSelectedNeuron}
            rightSelectedNeuron={rightSelectedNeuron}
            animationState={animationStates[synapseIndex]}
            leftOutput={leftOutputs[i]}
            rightInput={rightInputs[j]}
            currentWeight={currentWeights[synapseIndex]}
            weightHistory={weightHistories[synapseIndex]}
            setSynapseInfoBoxProps={setSynapseInfoBoxProps}
            key={`Synapse(${i},${j})`}
          ></Synapse>
        );
      } else {
        activatedSynapses.push(
          <Synapse
            x1={layerLeftOffset + neuronWidth * 0.91}
            x2={layerLeftOffset + layerSpacing + neuronWidth * 0.91}
            y1={neuronTopOffsetLeft + neuronVerticalSpacing * i + neuronHeight * 1.27}
            y2={neuronTopOffsetRight + neuronVerticalSpacing * j + neuronHeight * 1.27}
            leftNeuronId={i}
            rightNeuronId={j}
            leftLayerId={leftLayerId}
            rightLayerId={rightLayerId}
            leftSelectedNeuron={leftSelectedNeuron}
            rightSelectedNeuron={rightSelectedNeuron}
            animationState={animationStates[synapseIndex]}
            leftOutput={leftOutputs[i]}
            rightInput={rightInputs[j]}
            currentWeight={currentWeights[synapseIndex]}
            weightHistory={weightHistories[synapseIndex]}
            setSynapseInfoBoxProps={setSynapseInfoBoxProps}
            key={`Synapse(${i},${j})`}
          ></Synapse>
        );
      }
      synapseIndex++;
    }
  }

  return (
    <>
      {synapses}
      {activatedSynapses}
    </>
  );
}
