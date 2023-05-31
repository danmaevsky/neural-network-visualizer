import Rainbow from "rainbowvis.js";
import { motion } from "framer-motion";
import React from "react";

export function SlidingFilterPage(props) {
  // visual parameters
  const tileHeight = props.tileHeight;
  const tileWidth = props.tileWidth;
  const leftOffset = props.leftOffset;
  const topOffset = props.topOffset;
  const colorScheme = props.colorScheme;
  const forwardPropTimePerLayer = props.forwardPropTimePerLayer;

  // information
  const layerId = props.layerId;
  const filterId = props.filterId;
  const pageId = props.pageId;
  const filterTensor = props.filterTensor;
  const activationMapSize = props.activationMapSize;
  const layerAnimation = props.layerAnimation;
  let filterSize = filterTensor.dims[0];

  let slideSpeed = forwardPropTimePerLayer / (activationMapSize * activationMapSize);
  let layerDelay = forwardPropTimePerLayer * layerId;

  let tiles = [];
  for (let i = 0; i < filterSize; i++) {
    for (let j = 0; j < filterSize; j++) {
      const indices = [i, j, pageId];
      let value = filterTensor.get(indices);
      tiles.push(
        <FilterPageTile
          height={tileHeight}
          width={tileWidth}
          x={j * tileWidth}
          y={i * tileHeight}
          value={value}
          colorScheme={colorScheme}
          key={`SlidingFilterPageTile(L${layerId},F${filterId},P${pageId},i${i},j${j})`}
        ></FilterPageTile>
      );
    }
  }

  // create coordinates
  let x = [];
  let y = [];
  for (let i = 0; i < activationMapSize; i++) {
    for (let j = 0; j < activationMapSize; j++) {
      x.push(leftOffset + j * tileWidth);
      y.push(topOffset + i * tileHeight);
    }
  }

  let filterDelay = filterId * filterSize * slideSpeed;
  // filterDelay = 0;
  layerDelay = 0;

  let initial = {
    translateX: leftOffset,
    translateY: topOffset,
  };

  let animation = {
    translateX: x,
    translateY: y,
  };
  let transition = {
    duration: forwardPropTimePerLayer,
    delay: filterDelay + layerDelay,
  };

  let pageVariants = {
    visible: {
      translateX: x,
      translateY: y,
      opacity: 0.5,
      transition: {
        duration: forwardPropTimePerLayer,
        delay: filterDelay + layerDelay,
      },
      hidden: {
        translateX: leftOffset,
        translateY: topOffset,
        opacity: 0.5,
      },
    },
  };

  if (layerAnimation === "backPropAnimation") {
    pageVariants = {
      visible: {
        translateX: x,
        translateY: y,
        opacity: 0,
        transition: {
          duration: 1,
        },
        hidden: {
          translateX: leftOffset,
          translateY: topOffset,
          opacity: 0,
        },
      },
    };
  }

  return (
    <motion.g className="slidingFilterPage" initial="hidden" animate="visible" variants={pageVariants}>
      {tiles}
    </motion.g>
  );
}

const FilterPageTile = React.memo(function FilerPageTile(props) {
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const colorScheme = props.colorScheme;
  const value = props.value;

  let initial = {
    translateX: x,
    translateY: y,
  };

  let color = computeTileColor(colorScheme, value);

  return (
    <motion.rect className="filterPageTile" height={height} width={width} initial={initial} strokeWidth="0.1" stroke="black" fill={`#${color}`} />
  );
});

function computeTileColor(colorScheme, value) {
  if (colorScheme === "red") {
    let gradient = new Rainbow();
    gradient.setSpectrum("red", "white");
    let mappedValue = (value * 100) / 2 + 50;
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "orange") {
    let gradient = new Rainbow();
    gradient.setSpectrum("orange", "white");
    let mappedValue = (value * 100) / 2 + 50;
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "green") {
    let gradient = new Rainbow();
    gradient.setSpectrum("#68a947", "white");
    let mappedValue = (value * 100) / 2 + 50;
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "teal") {
    let gradient = new Rainbow();
    gradient.setSpectrum("teal", "white");
    let mappedValue = (value * 100) / 2 + 50;
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "blue") {
    let gradient = new Rainbow();
    gradient.setSpectrum("#00aaff", "white");
    let mappedValue = (value * 100) / 2 + 50;
    return gradient.colorAt(mappedValue);
  }
  if (colorScheme === "purple") {
    let gradient = new Rainbow();
    gradient.setSpectrum("#9580ff", "white");
    let mappedValue = (value * 100) / 2 + 50;
    return gradient.colorAt(mappedValue);
  }
}
