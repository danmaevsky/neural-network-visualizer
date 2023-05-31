import { Filter } from "./Filter/Filter";
import { useRef, useEffect } from "react";
import "./ConvolutionalLayer.css";

export function ConvolutionalLayer(props) {
  // logical parameters
  const layerId = props.layerId;
  const selectedLayerId = props.selectedLayerId;
  const layerOnClick = props.layerOnClick;

  // filter click functionality
  const setSelectedFilter = props.setSelectedFilter;
  const selectedFilter = props.selectedFilter;
  const setShowFilterInfoBox = props.setShowFilterInfoBox;

  // visual parameters
  const filterSize = props.filterSize;
  const filterDepth = props.filterDepth;
  const filterVerticalSpacing = props.filterVerticalSpacing;
  const numFilters = props.numFilters;
  const height = props.height;
  const width = props.width;
  const filterHeight = props.filterHeight;
  const filterWidth = props.filterWidth;
  const x = props.x;
  const y = props.y;

  // useRef important for animation
  let wasPrevSelected = useRef(true); // true because we want the animation to play when first adding a layer too
  let prevNumFilters = useRef(0); // when we add a layer, we only add 1 neuron. To ensure the conditional below fires, we make this 0
  useEffect(() => {
    prevNumFilters.current = numFilters;
    wasPrevSelected.current = selectedLayerId === layerId;
  });

  const filterLeftOffset = (width - filterWidth) / 2;
  const filterTopOffset = (height - (numFilters - 1) * filterVerticalSpacing) / 2 - filterHeight / 2;

  let filters = [];
  let colors = ["red", "orange", "green", "teal", "blue", "purple"];
  for (let i = numFilters - 1; i >= 0; i--) {
    let key = layerId === selectedLayerId ? Math.random() : `n${i}L${layerId}`;
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
        if (numFilters > prevNumFilters.current) {
          if (i === 0) {
            popOrSlide = "popIn";
          } else {
            popOrSlide = "slideDown";
          }
        } else if (numFilters < prevNumFilters.current) {
          popOrSlide = "slideUp";
        }
      }
    }

    let color = colors[i];

    filters.push(
      <Filter
        color={color}
        x={filterLeftOffset + x}
        y={filterTopOffset + y + filterVerticalSpacing * i}
        filterHeight={filterHeight}
        filterWidth={filterWidth}
        filterDepth={filterDepth}
        filterSize={filterSize}
        popOrSlide={popOrSlide}
        layerId={layerId}
        filterId={i}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setShowFilterInfoBox={setShowFilterInfoBox}
        key={key}
      ></Filter>
    );
  }

  let className = layerId === selectedLayerId ? "selectedConvolutionalLayer" : "convolutionalLayer";
  return (
    <g className={className} tabIndex={-1} onClick={layerOnClick}>
      <rect className="convolutionalLayerBackground" x={x} y={y} height={height} width={width} rx={width * 0.1} fill="white"></rect>
      {filters}
    </g>
  );
}

export function CNNSelectionAnimation(props) {
  const selectionState = props.selectionState;

  if (selectionState === "selected") {
    return (
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0;0,-100; 0,0"
        dur="1s"
        calcMode="spline"
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
        repeatCount="indefinite"
        fill="freeze"
      />
    );
  } else if (selectionState === "deselected") {
  }
}
