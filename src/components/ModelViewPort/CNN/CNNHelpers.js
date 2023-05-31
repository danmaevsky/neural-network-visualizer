import { Tensor } from "../../../Helpers";
import { ActivationMap } from "./ActivationMap/ActivationMap";
import { SlidingFilterPage } from "./SlidingFilterPage/SlidingFilterPage";

export function cloneModelParametersCNN(modelParameters) {
  let temp = structuredClone(modelParameters);
  for (let i = 0; i < temp.layerInfo.length; i++) {
    temp.layerInfo[i].filterWeightHistories = modelParameters.layerInfo[i].filterWeightHistories;
    temp.layerInfo[i].filterWeights = modelParameters.layerInfo[i].filterWeights;
    temp.layerInfo[i].activationMaps = modelParameters.layerInfo[i].activationMaps;
  }
  return temp;
}

export function updateTensors(temp) {
  for (let layerId = 0; layerId < temp.layerInfo.length; layerId++) {
    let filterDepth = 0;
    if (temp.dataset === "MNIST") {
      filterDepth = 1;
    } else {
      filterDepth = 3;
    }
    if (layerId > 0) {
      filterDepth = temp.layerInfo[layerId - 1].numFilters;
    }
    let filterSize = temp.layerInfo[layerId].filterSize;
    let numFilters = temp.layerInfo[layerId].numFilters;
    let newFilterWeights = [];
    let newFilterWeightHistories = [];
    for (let i = 0; i < numFilters; i++) {
      let rand = new Array(filterSize * filterSize * filterDepth).fill(null);
      newFilterWeights.push(new Tensor([filterSize, filterSize, filterDepth], rand));
      newFilterWeightHistories.push([]);
    }
    temp.layerInfo[layerId].filterDepth = filterDepth;
    temp.layerInfo[layerId].filterWeights = newFilterWeights;
    temp.layerInfo[layerId].filterWeightHistories = newFilterWeightHistories;
  }
}

export function CreateCNNAnimationComponents(
  modelParameters,
  viewPortHeight,
  filterHeight,
  filterWidth,
  filterVerticalSpacing,
  layerHeight,
  layerWidth,
  layerTopOffset,
  layerSpacing,
  layerLeftOffset,
  activationMapHeight,
  activationMapWidth,
  displayedImageHeight,
  displayedImageWidth
) {
  // CREATING ANIMATION COMPONENTS
  let numLayers = modelParameters.layerInfo.length;
  let colors = ["red", "orange", "green", "teal", "blue", "purple"];
  let activationMaps = [];
  let slidingFilterPages = [];
  // let dataOrbs = [];
  for (let i = 0; i < numLayers; i++) {
    let layerAnimation = modelParameters.animationProperties.layerAnimations[i];
    // if we are in the animating phase i.e. the animations are not null
    if (layerAnimation === null || layerAnimation === undefined) {
      activationMaps.push(null);
      slidingFilterPages.push(null);
    } else if (layerAnimation === "startStrideAnimation" || layerAnimation === "backPropAnimation") {
      let numFilters = modelParameters.layerInfo[i].numFilters;
      let activationMapSize = modelParameters.layerInfo[i].activationMaps[0].dims[0];

      // we need to create appropriate, synchronized timings here
      let forwardPropTimePerLayer = 4;
      let slideSpeed = forwardPropTimePerLayer / (activationMapSize * activationMapSize);

      // ActivationMap, one for each filter
      for (let f = 0; f < numFilters; f++) {
        // let animationProps = layerAnimation[f];
        let colorScheme = colors[f];
        let filterSize = modelParameters.layerInfo[i].filterSize;

        let mapTensor = modelParameters.layerInfo[i].activationMaps[f];
        let actMapTopOffset =
          (layerHeight - (numFilters - 1) * filterVerticalSpacing) / 2 + f * filterVerticalSpacing - (activationMapHeight - filterHeight) / 2;
        let actMapLeftOffset = layerLeftOffset + layerSpacing * i + layerWidth + activationMapWidth / 4;
        activationMaps.push(
          <ActivationMap
            height={activationMapHeight}
            width={activationMapWidth}
            x={actMapLeftOffset}
            y={actMapTopOffset}
            colorScheme={colorScheme}
            mapTensor={mapTensor}
            filterId={f}
            layerId={i}
            filterSize={filterSize}
            forwardPropTimePerLayer={forwardPropTimePerLayer}
            layerAnimation={layerAnimation}
            // iFill={animationProps.stridePos.iPos}
            // jFill={animationProps.stridePos.jPos}
            key={`SlidingFilterPage(L${i},F${f})`}
          />
        );

        // SlidingFilterPage, one for each filter and depth
        let filterTensor = modelParameters.layerInfo[i].filterWeights[f];
        if (filterTensor === undefined) {
          console.log("Undefined Filter Weight: ");
          console.log("    Layer: " + i);
          console.log("    Filter: " + f);
          console.log("    Animation State: " + layerAnimation);
          console.log("    Information from Backend: ");
          console.log(modelParameters);
        }
        let filterDepth = modelParameters.layerInfo[i].filterDepth;
        for (let pageId = 0; pageId < filterDepth; pageId++) {
          let slidingPageLeftOffset = layerSpacing * i;
          let slidingPageTopOffset = (layerHeight - (numFilters - 1) * filterVerticalSpacing) / 2 - (activationMapHeight - filterHeight) / 2;
          let tileHeight = activationMapHeight / mapTensor.dims[0];
          let tileWidth = activationMapWidth / mapTensor.dims[1];
          if (i === 0) {
            // scan over the image
            slidingPageLeftOffset = (layerLeftOffset - displayedImageWidth) / 2;
            slidingPageTopOffset = (viewPortHeight - displayedImageWidth) / 2;
            tileHeight = displayedImageHeight / 32;
            tileWidth = displayedImageWidth / 32;
          } else if (i > 0) {
            // scan over previous layer's activation maps
            let prevLayerNumFilters = modelParameters.layerInfo[i - 1].numFilters;
            let prevLayerActMapSize = modelParameters.layerInfo[i - 1].activationMaps[0].dims[0];
            tileHeight = activationMapHeight / prevLayerActMapSize;
            tileWidth = activationMapWidth / prevLayerActMapSize;
            slidingPageLeftOffset = layerLeftOffset + layerWidth + activationMapWidth / 4 + layerSpacing * (i - 1);
            slidingPageTopOffset =
              (layerHeight - (prevLayerNumFilters - 1) * filterVerticalSpacing) / 2 -
              (activationMapHeight - filterHeight) / 2 +
              pageId * filterVerticalSpacing;
          }
          let { initial, animation, transition } = generateFilterPageAnimation(
            layerAnimation,
            tileHeight,
            tileWidth,
            slidingPageLeftOffset,
            slidingPageTopOffset,
            activationMapSize,
            i,
            f,
            filterSize,
            slideSpeed,
            forwardPropTimePerLayer
          );
          slidingFilterPages.push(
            <SlidingFilterPage
              layerAnimation={layerAnimation}
              tileHeight={tileHeight}
              tileWidth={tileWidth}
              leftOffset={slidingPageLeftOffset}
              topOffset={slidingPageTopOffset}
              colorScheme={colorScheme}
              layerId={i}
              filterId={f}
              pageId={pageId}
              filterTensor={filterTensor}
              activationMapSize={activationMapSize}
              forwardPropTimePerLayer={forwardPropTimePerLayer}
              initial={initial}
              animate={animation}
              transition={transition}
              // iPos={animationProps.stridePos.iPos}
              // jPos={animationProps.stridePos.jPos}
              key={`SlidingFilterPage(L${i},F${f},P${pageId})`}
            />
          );
        }

        // DataOrb, one for each SlidingFilterPage
      }
    }
  }

  return { activationMaps: activationMaps, slidingFilterPages: slidingFilterPages };
}

function generateFilterPageAnimation(
  layerAnimation,
  tileHeight,
  tileWidth,
  leftOffset,
  topOffset,
  activationMapSize,
  layerId,
  filterId,
  filterSize,
  slideSpeed,
  forwardPropTimePerLayer
) {
  if (layerAnimation === "startStrideAnimation") {
    let x = [];
    let y = [];
    for (let i = 0; i < activationMapSize; i++) {
      //   for (let j = 0; j < activationMapSize; j++) {
      //     x.push(leftOffset + j * tileWidth);
      //     y.push(topOffset + i * tileHeight);
      //   }
      x.push(leftOffset);
      x.push(leftOffset + (activationMapSize - 1) * tileWidth);
      y.push(topOffset + i * tileHeight);
      y.push(topOffset + i * tileHeight);
    }

    let layerDelay = layerId * forwardPropTimePerLayer;
    let filterDelay = filterId * filterSize * slideSpeed;

    let initial = {
      opacity: 0.7,
      translateX: leftOffset,
      translateY: topOffset,
    };

    let animation = {
      translateX: x,
      translateY: y,
    };
    let transition = {
      duration: forwardPropTimePerLayer,
      delay: layerDelay + filterDelay,
    };

    return { initial, animation, transition };
  } else if (layerAnimation === "backPropAnimation") {
    let initial = {
      opacity: 0.7,
    };
    let animation = {
      opacity: 0,
    };
    let transition = {
      duration: 1,
    };
    return { initial, animation, transition };
  }
}

// DEV TOOLS
export function RandomArray(size, range) {
  let arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = Math.random() * (range[1] - range[0]) + range[0];
  }
  return arr;
}
