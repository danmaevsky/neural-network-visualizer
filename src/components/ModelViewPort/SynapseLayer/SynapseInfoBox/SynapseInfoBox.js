import { useEffect, useState, useRef } from "react";
// import inputNeuronSvg from "./inputNeuron.svg";
// import outputNeuronSvg from "./outputNeuron.svg";
import "./SynapseInfoBox.css";

export function SynapseInfoBox(props) {
  // visual parameters
  const height = props.height;
  const width = props.width;
  const layerHeight = props.layerHeight;
  const layerLeftOffset = props.layerLeftOffset;
  const layerSpacing = props.layerSpacing;
  const neuronVerticalSpacing = props.neuronVerticalSpacing;
  const neuronHeight = props.neuronHeight;
  // const neuronWidth = neuronHeight;

  const modelParameters = props.modelParameters;

  const setShowSynapseInfoBox = props.setShowSynapseInfoBox;
  const setSynapseInfoBoxProps = props.setSynapseInfoBoxProps;
  const leftSelectedNeuron = props.leftSelectedNeuron;
  const setLeftSelectedNeuron = props.setLeftSelectedNeuron;
  const rightSelectedNeuron = props.rightSelectedNeuron;
  const setRightSelectedNeuron = props.setRightSelectedNeuron;

  // synapse properties
  const leftOutput = props.leftOutput;
  const currentWeight = props.currentWeight;
  const rightInput = props.rightInput;
  const weightHistory = props.weightHistory;

  let leftNumNeurons = modelParameters.numNeuronsPerLayer[leftSelectedNeuron.layerId];
  let rightNumNeurons = modelParameters.numNeuronsPerLayer[rightSelectedNeuron.layerId];

  // let leftNeuronTopOffset = (layerHeight - (leftNumNeurons - 1) * neuronVerticalSpacing) / 2;
  let rightNeuronTopOffset = (layerHeight - (rightNumNeurons - 1) * neuronVerticalSpacing) / 2;
  let y = rightNeuronTopOffset + neuronVerticalSpacing * rightSelectedNeuron.neuronId;
  let renderAbove = rightSelectedNeuron.neuronId > rightNumNeurons / 2 - 1;

  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSynapseInfoBox(false);
      setSynapseInfoBoxProps({
        leftOutput: "N/A",
        currentWeight: "N/A",
        rightInput: "N/A",
        weightHistory: [0, 1, 1, 2],
      });
      setLeftSelectedNeuron({
        neuronId: null,
        layerId: null,
      });
      setRightSelectedNeuron({
        neuronId: null,
        layerId: null,
      });
    }
  };

  // set focus here on render
  const ref = useRef(null);
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <g className="synapseInfoBox">
      <svg
        viewBox="-1 -1 102 172"
        tabIndex="-1"
        ref={ref}
        onBlur={onClickOutside}
        height={height}
        width={width}
        x={layerLeftOffset + layerSpacing * leftSelectedNeuron.layerId + layerSpacing * 1.5}
        y={y + (renderAbove ? -height * 0.8 : height * 0.05)}
      >
        <rect width="100" height="170" rx="2" fill="white" stroke="black" strokeWidth="0.5" x="0" y="0"></rect>
        <text className="neuronInfoBoxHeading" textAnchor="middle" fontSize="8" x="50" y="13">
          Connection Info
        </text>
        <line x1="30" x2="70" y1="17" y2="17" strokeWidth="0.6"></line>
        <g>
          <text className="neuronInfoBoxProperty" fontWeight="300" fontSize="6" x="14" y="32">
            Output
          </text>
          <circle cx="9" cy="30" r="3" fill="#deffe4" stroke="#3e508a" />
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="95" y="32">
            {leftOutput}
          </text>
        </g>
        <g>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="45">
            Current
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="52">
            Weight Value:
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="95" y="49">
            {currentWeight}
          </text>
        </g>
        <g>
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="300" x="14" y="64">
            Net Input:
          </text>
          <circle cx="9" cy="62" r="3" fill="#ffdefa" stroke="#3e508a" />
          <text className="neuronInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="95" y="64">
            {rightInput}
          </text>
        </g>
        <g>
          <text className="neuronInfoBoxProperty" textAnchor="middle" fontSize="4.7" fontWeight="300" x="50" y="85">
            Weight Value vs. Training Iteration
          </text>
          <text className="neuronInfoBoxProperty" fontSize="6" x="6" y="104"></text>
        </g>
        <WeightHistoryChart height="70" width="70" weightHistory={weightHistory} x="15" y="90" />
        <text fontSize="4.7" fontWeight="300" textAnchor="middle" transform="rotate(-90, 13, 122)" x="13" y="122">
          Weight Value
        </text>
        <text fontSize="4.7" fontWeight="300" textAnchor="middle" x="50" y="165">
          Iteration
        </text>
      </svg>
    </g>
    // <div className="synapseInfoBox" tabIndex="-1" ref={ref} onBlur={onClickOutside}>
    //   <h1 className="connectionHeader">Connection Info</h1>
    //   <div className="information">
    //     <div className="infoLeft">
    //       <p>
    //         <img src={inputNeuronSvg} /> Output:
    //       </p>
    //       <p>Current Weight:</p>
    //       <p>
    //         <img src={outputNeuronSvg} /> Net Input:
    //       </p>
    //     </div>
    //     <div className="infoRight">
    //       <p>{leftOutput}</p>
    //       <p>{currentWeight}</p>
    //       <p>{rightInput}</p>
    //     </div>
    //   </div>
    //   <WeightHistoryChart />
    // </div>
  );
}

function WeightHistoryChart(props) {
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const weightHistory = props.weightHistory;

  const plotRelHeight = 100;
  const plotRelWidth = 100;
  let points = [];
  let lines = [];

  if (weightHistory !== undefined) {
    const max = Math.max(...weightHistory.map((n) => Math.abs(n)));

    for (let i = 0; i < weightHistory.length; i++) {
      let value = weightHistory[i];
      let x = (plotRelWidth / (weightHistory.length - 1)) * i;
      let y = plotRelHeight * (1 - (value + max) / (2 * max));
      points.push(
        <PlotPoint value={weightHistory[i]} x={x} y={y} plotRelHeight={plotRelHeight} plotRelWidth={plotRelWidth} key={`PlotPoint(${i})`}></PlotPoint>
      );
    }

    for (let i = 1; i < weightHistory.length; i++) {
      let x1 = (plotRelWidth / (weightHistory.length - 1)) * (i - 1);
      let x2 = (plotRelWidth / (weightHistory.length - 1)) * i;
      let y1 = plotRelHeight * (1 - (weightHistory[i - 1] + max) / (2 * max));
      let y2 = plotRelHeight * (1 - (weightHistory[i] + max) / (2 * max));
      lines.push(<PlotLine x1={x1} x2={x2} y1={y1} y2={y2} key={`PlotLine(${i - 1},${i})`}></PlotLine>);
    }
  }

  return (
    <g className="weightHistoryChart">
      <svg viewBox="-5 -15 108 120" height={height} width={width} x={x} y={y}>
        <line className="plotXaxis" x1="0" y1={plotRelHeight / 2} x2={plotRelWidth} y2={plotRelHeight / 2} stroke="#000"></line>
        <line className="plotYaxis" x1="0" y1="0" x2="0" y2={plotRelHeight} stroke="#000"></line>
        {lines}
        {points}
      </svg>
    </g>
  );
}

function PlotPoint(props) {
  const value = props.value;
  const x = props.x;
  const y = props.y;
  const plotRelHeight = props.plotRelHeight;
  const plotRelWidth = props.plotRelWidth;
  const [showValue, setShowValue] = useState(false);

  return (
    <g>
      <circle
        className="plotPoint"
        onMouseOver={() => setShowValue(true)}
        onMouseOut={() => setShowValue(false)}
        cx={x}
        cy={y}
        r="2.75"
        fill="orange"
      ></circle>
      {showValue ? (
        <g>
          <text textAnchor="middle" x={50} y={-5} fontSize="9">
            {value}
          </text>
        </g>
      ) : null}
    </g>
  );
}

function PlotLine(props) {
  const x1 = props.x1;
  const y1 = props.y1;
  const x2 = props.x2;
  const y2 = props.y2;

  return <line className="plotLine" x1={x1} x2={x2} y1={y1} y2={y2}></line>;
}
