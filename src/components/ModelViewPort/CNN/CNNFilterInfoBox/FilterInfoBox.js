import { useRef, useEffect, useState } from "react";
import useArray from "../../../../hooks/useArray";
import Rainbow from "rainbowvis.js";
import "./FilterInfoBox.css";

export function FilterInfoBox(props) {
  const setShowFilterInfoBox = props.setShowFilterInfoBox;
  const selectedFilter = props.selectedFilter;
  const setSelectedFilter = props.setSelectedFilter;

  // visual parameters and computations
  const height = props.height;
  const width = props.width;
  const layerSpacing = props.layerSpacing;
  const layerHeight = props.layerHeight;
  const layerLeftOffset = props.layerLeftOffset;
  const filterHeight = props.filterHeight;
  const filterWidth = props.filterWidth;
  const filterVerticalSpacing = props.filterVerticalSpacing;
  const modelParameters = props.modelParameters;
  const colors = ["red", "orange", "green", "teal", "blue", "purple"];

  let numFilters = modelParameters.layerInfo[selectedFilter.layerId].numFilters;
  let filterTopOffset = (layerHeight - (numFilters - 1) * filterVerticalSpacing) / 2;
  let renderAbove = selectedFilter.filterId > numFilters / 2 - 1;
  let renderLeft = selectedFilter.layerId > 4;

  // information parameters
  let activationFunction = modelParameters.layerInfo[selectedFilter.layerId].activationFunction;
  let filterSize = modelParameters.layerInfo[selectedFilter.layerId].filterSize;
  /* CHANGE THIS TO HANDLE RGB IMAGES LATER */
  let filterDepth = modelParameters.layerInfo[selectedFilter.layerId].filterDepth;

  // Bring focus here upon render
  const ref = useRef(null);
  useEffect(() => {
    ref.current.focus();
  }, []);

  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowFilterInfoBox(false);
      setSelectedFilter({
        neuronId: null,
        layerId: null,
      });
    }
  };

  // Weight Chart
  /*
  When you click on a tile on the filter, you should see a chart displaying the change over time of that filter tile
  just like when you select a synapse in a Multilayer Perceptron model
  */
  const [showWeightChart, setShowWeightChart] = useState(false);
  const [weightHistory, weightHistoryArrayMethods] = useArray([]);
  const [selectedTile, setSelectedTile] = useState({ i: null, j: null, k: null });
  let displayWeightChart = (i, j, k) => {
    setShowWeightChart(true);
    let temp = [];
    for (let e = 0; e < modelParameters.layerInfo[selectedFilter.layerId].filterWeightHistories[selectedFilter.filterId].length; e++) {
      let currEpochFilterWeights = modelParameters.layerInfo[selectedFilter.layerId].filterWeightHistories[selectedFilter.filterId][e];
      let weight = currEpochFilterWeights.get([i, j, k]);
      temp.push(weight);
    }
    weightHistoryArrayMethods.set(temp);
  };
  useEffect(() => {
    if (selectedTile.i === null) {
      setShowWeightChart(false);
    }
  }, [selectedTile]);

  let filterPages = [];
  let filterPageHeight = 30;
  let filterPageWidth = 30;
  for (let i = 0; i < filterDepth; i++) {
    let xPage = 120 + (filterPageWidth + 10) * (i % 3);
    let yPage = i > 2 ? 40 + filterPageHeight + 10 : 40;
    filterPages.push(
      <FilterPage
        height={filterPageHeight}
        width={filterPageWidth}
        x={xPage}
        y={yPage}
        layerId={selectedFilter.layerId}
        filterId={selectedFilter.filterId}
        pageId={i}
        colorScheme={colors[selectedFilter.filterId]}
        colorSchemeComplement={colors[(selectedFilter.filterId + 3) % 6]}
        modelParameters={modelParameters}
        displayWeightChart={displayWeightChart}
        selectedTile={selectedTile}
        setSelectedTile={setSelectedTile}
        setShowWeightChart={setShowWeightChart}
        key={`FilterPageTile(${i})`}
      ></FilterPage>
    );
  }

  return (
    <g className="filterInfoBox">
      <svg
        viewBox="-1 -1 242 202"
        tabIndex="-1"
        ref={ref}
        onBlur={onClickOutside}
        height={height}
        width={width}
        x={layerLeftOffset + layerSpacing * selectedFilter.layerId + filterWidth * 1.3 + (renderLeft ? -width * 1.2 : 0)}
        y={filterTopOffset + filterVerticalSpacing * selectedFilter.filterId + (renderAbove ? -filterHeight * 4 : 0)}
      >
        <rect className="background" width="240" height="200" rx="2" fill="white" stroke="black" strokeWidth="0.5" x="0" y="0"></rect>
        <text className="filterInfoBoxHeading" textAnchor="middle" fontSize="8" x="120" y="13">
          Filter Info
        </text>
        <line x1="100" x2="140" y1="17" y2="17" strokeWidth="0.6"></line>
        <g>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="37">
            Activation
          </text>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="44">
            Function:
          </text>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="75" y="40">
            {activationFunction}
          </text>
        </g>
        <g>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="78">
            Filter Size:
          </text>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="75" y="78">
            {filterSize}
          </text>
        </g>
        <g>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="300" x="6" y="114">
            Filter Depth:
          </text>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="600" textAnchor="end" x="75" y="114">
            {filterDepth}
          </text>
        </g>
        <g>
          <text className="filterInfoBoxProperty" fontSize="6" fontWeight="300" textAnchor="middle" x="174" y="37">
            Filter Pages:
          </text>
        </g>
        <g className="filterPages">{filterPages}</g>
        {showWeightChart ? (
          <g className="filterWeightHistoryChart">
            <text className="filterInfoBoxProperty" fontSize="6" fontWeight="500" x="170" y="160" textAnchor="middle">
              Weight Value vs. Training Iteration
            </text>
            <text
              className="filterInfoBoxProperty"
              fontSize="5.5"
              fontWeight="300"
              x="27"
              y="155"
              textAnchor="middle"
              transform="rotate(-90, 27, 155)"
            >
              Weight Value
            </text>
            <text className="filterInfoBoxProperty" fontSize="5.5" fontWeight="300" textAnchor="middle" x="65" y="195">
              Iteration
            </text>
            <WeightHistoryChart height="70" width="70" x="30" y="120" textAnchor="middle" weightHistory={weightHistory} />
          </g>
        ) : null}
      </svg>
    </g>
  );
}

function FilterPage(props) {
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const layerId = props.layerId;
  const filterId = props.filterId;
  const pageId = props.pageId;
  const colorScheme = props.colorScheme;
  const colorSchemeComplement = props.colorSchemeComplement;
  const modelParameters = props.modelParameters;
  const displayWeightChart = props.displayWeightChart;
  const selectedTile = props.selectedTile;
  const setSelectedTile = props.setSelectedTile;
  const setShowWeightChart = props.setShowWeightChart;

  let filterSize = modelParameters.layerInfo[layerId].filterSize;
  let tileHeight = height / filterSize;
  let tileWidth = width / filterSize;

  let filterTensor = modelParameters.layerInfo[layerId].filterWeights[filterId];
  let tiles = [];
  for (let i = 0; i < filterSize; i++) {
    for (let j = 0; j < filterSize; j++) {
      const indices = [i, j, pageId];
      const isSelected = i === selectedTile.i && j === selectedTile.j && pageId === selectedTile.k;
      let value = filterTensor.get(indices);
      tiles.push(
        <FilterPageTile
          height={tileHeight}
          width={tileWidth}
          i={i}
          j={j}
          k={pageId}
          x={x + j * tileWidth}
          y={y + i * tileHeight}
          colorScheme={isSelected ? colorSchemeComplement : colorScheme}
          value={value}
          displayWeightChart={displayWeightChart}
          selectedTile={selectedTile}
          setSelectedTile={setSelectedTile}
          setShowWeightChart={setShowWeightChart}
          key={`FilterPageTile(${i},${j},${pageId})`}
        ></FilterPageTile>
      );
    }
  }

  // if (selectedTile.k === pageId) {
  //   tiles.push(
  //     <FilterPageTile
  //       height={tileHeight}
  //       width={tileWidth}
  //       i={selectedTile.i}
  //       j={selectedTile.j}
  //       k={selectedTile.k}
  //       x={x + selectedTile.j * tileWidth}
  //       y={y + selectedTile.i * tileHeight}
  //       colorScheme={colorScheme}
  //       value={filterTensor.get([selectedTile.i, selectedTile.j, selectedTile.k])}
  //       displayWeightChart={displayWeightChart}
  //       selectedTile={selectedTile}
  //       setSelectedTile={setSelectedTile}
  //     ></FilterPageTile>
  //   );
  // }

  return (
    <g className="filterPage">
      {tiles}
      <text className="filterInfoBoxProperty" fontSize="5.5" fontWeight="300" textAnchor="middle" x={x + width / 2} y={y + height + 5.5}>
        {pageId}
      </text>
    </g>
  );
}

function FilterPageTile(props) {
  const height = props.height;
  const width = props.width;
  const i = props.i;
  const j = props.j;
  const k = props.k;
  const x = props.x;
  const y = props.y;
  const colorScheme = props.colorScheme;
  const value = props.value;
  const displayWeightChart = props.displayWeightChart;
  const selectedTile = props.selectedTile;
  const setSelectedTile = props.setSelectedTile;
  const setShowWeightChart = props.setShowWeightChart;

  // let prevValue = useRef(value);

  let tileOnClick = () => {
    setSelectedTile({ i: i, j: j, k: k });
    displayWeightChart(i, j, k);
  };

  let tileOnBlur = () => {
    setSelectedTile({ i: null, j: null, k: null });
  };

  const isSelected = i === selectedTile.i && j === selectedTile.j && k === selectedTile.k;
  useEffect(() => {
    if (isSelected) {
      displayWeightChart(i, j, k);
    }
  }, [value]);

  let color = computeTileColor(colorScheme, value);

  return (
    <g onClick={tileOnClick} onBlur={tileOnBlur} tabIndex={isSelected ? 1 : -1}>
      <rect className="filterPageTile" height={height} width={width} x={x} y={y} strokeWidth={0.1} stroke="black" fill={`#${color}`} />
      {/* <text>{value}</text> */}
    </g>
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
        cx={isNaN(x) ? 0 : x}
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

function computeTileColor(colorScheme, value) {
  let mappedValue = (value * 100) / 2 + 50;
  if (colorScheme === "red") {
    let gradient = new Rainbow();
    gradient.setSpectrum("red", "white");
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "orange") {
    let gradient = new Rainbow();
    gradient.setSpectrum("orange", "white");
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "green") {
    let gradient = new Rainbow();
    gradient.setSpectrum("#68a947", "white");
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "teal") {
    let gradient = new Rainbow();
    gradient.setSpectrum("teal", "white");
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "blue") {
    let gradient = new Rainbow();
    gradient.setSpectrum("#00aaff", "white");
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "purple") {
    let gradient = new Rainbow();
    gradient.setSpectrum("#9580ff", "white");
    return gradient.colorAt(mappedValue);
  }
}
