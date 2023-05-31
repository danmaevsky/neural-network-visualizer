import { motion } from "framer-motion";
import Rainbow from "rainbowvis.js";
import React from "react";
import { useEffect, useRef, useState } from "react";
import "./ActivationMap.css";

export const ActivationMap = React.memo(function ActivationMap(props) {
  // // visual parameters
  // const height = props.height;
  // const width = props.width;
  // const x = props.x;
  // const y = props.y;
  // const colorScheme = props.colorScheme;
  // const forwardPropTimePerLayer = props.forwardPropTimePerLayer;
  // const layerAnimation = props.layerAnimation;

  // // information values
  // const mapTensor = props.mapTensor;
  // let activationMapSize = mapTensor.dims[0];
  // const filterId = props.filterId;
  // const layerId = props.layerId;
  // const filterSize = props.filterSize;

  // let slideSpeed = forwardPropTimePerLayer / (activationMapSize * activationMapSize);
  // let layerDelay = forwardPropTimePerLayer * layerId;
  // let filterDelay = filterId * activationMapSize * activationMapSize * slideSpeed;

  // // create ActivationMap tiles and their animations
  // let tiles = [];
  // let tileHeight = height / activationMapSize;
  // let tileWidth = width / activationMapSize;
  // let tileCounter = 0;
  // let variants = {
  //   visible: {
  //     transition: {
  //       when: "beforeChildren",
  //       staggerChildren: slideSpeed,
  //       delayChildren: layerDelay,
  //     },
  //   },
  //   hidden: {},
  // };

  // //   variants = {};

  // //   tileVariants = {};
  // for (let i = 0; i < activationMapSize; i++) {
  //   for (let j = 0; j < activationMapSize; j++) {
  //     let value = mapTensor.get([i, j, 0]);
  //     let color = computeTileColor(colorScheme, value);
  //     // only fade in the newly added tile. The rest shall not be created
  //     //   let { tileInitial, tileAnimation, tileTransition } = generateAnimation(layerAnimation, slideSpeed, filterDelay, tileCounter);
  //     let tileVariants = {
  //       hidden: {
  //         translateX: x + j * tileWidth,
  //         translateY: y + i * tileHeight,
  //         opacity: 0,
  //       },
  //       visible: {
  //         translateX: x + j * tileWidth,
  //         translateY: y + i * tileHeight,
  //         opacity: 1,
  //         transition: {
  //           duration: slideSpeed * 20,
  //         },
  //       },
  //     };
  //     tileVariants = {};
  //     // tiles.push(
  //     //   <motion.rect
  //     //     className="activationMapTile"
  //     //     height={tileHeight}
  //     //     width={tileWidth}
  //     //     x={x + j * tileWidth}
  //     //     y={y + i * tileHeight}
  //     //     variants={tileVariants}
  //     //     strokeWidth="0"
  //     //     stroke="black"
  //     //     fill={`#${color}`}
  //     //   />
  //     // );
  //     tileCounter++;
  //   }
  // }

  // return (
  //   <motion.g className="activationMap" initial="hidden" animate="visible" variants={variants}>
  //     {tiles}
  //   </motion.g>
  // );
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const colorScheme = props.colorScheme;
  const forwardPropTimePerLayer = props.forwardPropTimePerLayer;

  const layerAnimation = props.layerAnimation;
  const layerId = props.layerId;
  const FPS = 30;

  // information
  const mapTensor = props.mapTensor;
  let activationMapSize = mapTensor.dims[0];

  let timePerTile = forwardPropTimePerLayer / (activationMapSize * activationMapSize);
  let tilePerFrame = (1 / timePerTile / FPS) * 1.5;

  let canvasRef = useRef(null);
  let fillRef = useRef({
    iFill: 0,
    jFill: 0,
  });
  let timeRef = useRef(Date.now());

  const updateTiles = () => {
    // console.log(fillRef.current);
    // animation is done condition
    if (fillRef.current.iFill > activationMapSize) {
      return;
    }
    // const scaleSpeed = (forwardPropTimePerLayer / activationMapSize / activationMapSize) * FPS;

    if (fillRef.current.jFill > activationMapSize) {
      fillRef.current.iFill = fillRef.current.iFill + 1;
      fillRef.current.jFill = 0;
    } else {
      fillRef.current.jFill += tilePerFrame;
    }
  };

  const renderMap = () => {
    // animation is done condition
    if (canvasRef.current === null) {
      return;
    }

    if (fillRef.current.iFill > activationMapSize - 1) {
      return;
    }
    timeRef.current = Date.now();

    const ctx = canvasRef.current.getContext("2d");
    const { iFill, jFill } = fillRef.current;

    ctx.clearRect(0, 0, width, height);
    let tileHeight = height / activationMapSize;
    let tileWidth = width / activationMapSize;
    ctx.imageSmoothingEnabled = false;
    for (let i = 0; i <= iFill; i++) {
      let jMax = i === iFill ? Math.min(jFill, activationMapSize - 1) : activationMapSize - 1;
      for (let j = 0; j <= jMax; j++) {
        let value = mapTensor.get([i, j, 0]);
        let color = computeTileColor(colorScheme, value);
        ctx.fillStyle = `#${color}`;
        ctx.fillRect(j * tileWidth, i * tileHeight, tileWidth, tileHeight);
      }
    }
  };

  const animate = () => {
    // request an animation frame
    requestAnimationFrame(animate);
    let frameInterval = 1000 / FPS; // 1000ms/1s divided by x frames/second results in units of ms/frame
    let now = Date.now();
    let elapsedTime = now - timeRef.current;

    if (elapsedTime >= frameInterval) {
      updateTiles();
      renderMap();
    }
  };

  useEffect(() => {
    animate();
  });

  let animation;
  if (layerAnimation === "backPropAnimation") {
    animation = {
      opacity: 0,
      x: x,
      y: y,
    };
  }

  return (
    <motion.canvas
      className="activationMap"
      ref={canvasRef}
      height={height}
      width={width}
      initial={{ x: x, y: y }}
      animate={animation}
    ></motion.canvas>
  );
});

// const ActivationMapTile = React.memo(function ActivationMapTile(props) {
//   // visual parameters
//   const height = props.width;
//   const width = props.width;
//   const colorScheme = props.colorScheme;
//   const variants = props.variants;

//   // information
//   const value = props.value;

//   let color = computeTileColor(colorScheme, value);

//   return (
//     // initial={initial}
//     // animate={animate}
//     // transition={transition}

//     <motion.rect className="activationMapTile" height={height} width={width} variants={variants} strokeWidth="0" stroke="black" fill={`#${color}`} />
//   );
// });

function generateAnimation(layerAnimation, slideSpeed, filterDelay, tileCounter) {
  if (layerAnimation === "startStrideAnimation") {
    let tileInitial = {
      opacity: 0,
    };
    let tileAnimation = {
      opacity: [0, 0.5, 1],
    };
    let tileTransition = {
      duration: slideSpeed * 10,
      delay: filterDelay + tileCounter * slideSpeed,
    };
    return { tileInitial, tileAnimation, tileTransition };
  } else if (layerAnimation === "backPropAnimation") {
    let tileAnimation = {
      opacity: 0,
    };
    let tileTransition = {
      duration: 1,
    };
    return { tileAnimation, tileTransition };
  }
}

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
