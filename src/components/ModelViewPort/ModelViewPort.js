import "./ModelViewPort.css";
// fundamentals
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useEffect, useState } from "react";

// MLP related
import { NeuronInfoBox } from "./NeuronInfoBox/NeuronInfoBox";
import { MLPLayer } from "./Layers/MLPLayer/MLPLayer";
import { MLPLayerInfoBox } from "./MLPLayerInfoBox/MLPLayerInfoBox";
import { SynapseLayer } from "./SynapseLayer/SynapseLayer";
import { SynapseInfoBox } from "./SynapseLayer/SynapseInfoBox/SynapseInfoBox";

// CNN related
import { ConvolutionalLayer } from "./CNN/ConvolutionalLayer/ConvolutionalLayer";
import { CNNLayerInfoBox } from "./CNN/CNNLayerInfoBox/CNNLayerInfoBox";
import { FilterInfoBox } from "./CNN/CNNFilterInfoBox/FilterInfoBox";
import { CreateCNNAnimationComponents } from "./CNN/CNNHelpers";

export function ModelViewPort(props) {
    // dynamically create model based on parameters e.g. networkType="Multilayer Perceptron" so create MLP visual
    const modelParameters = props.modelParameters;
    const setModelParameters = props.setModelParameters;
    const selectedLayer = props.selectedLayer;
    const setSelectedLayer = props.setSelectedLayer;
    const displayedImageSrc = props.displayedImageSrc;
    const displayedPrediction = props.displayedPrediction;

    // responsive to window resizing
    const windowDimensions = useWindowDimensions();
    const windowHeight = windowDimensions.height;
    const windowWidth = windowDimensions.width;
    const viewPortHeight = windowHeight - vhToPixel(12.5);

    // layerInfoBox
    const showLayerInfoBox = props.showLayerInfoBox;
    const setShowLayerInfoBox = props.setShowLayerInfoBox;

    // isAnimating
    const isAnimating = props.isAnimating;

    // useful functions
    function vhToPixel(vh) {
        return (vh * windowHeight) / 100;
    }

    function vwToPixel(vw) {
        return (vw * windowWidth) / 100;
    }

    if (modelParameters.networkType === null /*|| modelParameters.dataset === null || modelParameters.dataset === undefined*/) {
        return (
            <div className="modelViewPortNull">
                <h1>Start by selecting a Dataset and type of Algorithm from the dropdowns above!</h1>
            </div>
        );
    }

    if (modelParameters.networkType === "Multilayer Perceptron Network") {
        return (
            <MultilayerPerceptronNetwork
                windowHeight={windowHeight}
                windowWidth={windowWidth}
                viewPortHeight={viewPortHeight}
                vhToPixel={vhToPixel}
                vwToPixel={vwToPixel}
                displayedImageSrc={displayedImageSrc}
                displayedPrediction={displayedPrediction}
                modelParameters={modelParameters}
                setModelParameters={setModelParameters}
                selectedLayer={selectedLayer}
                setSelectedLayer={setSelectedLayer}
                showLayerInfoBox={showLayerInfoBox}
                setShowLayerInfoBox={setShowLayerInfoBox}
                isAnimating={isAnimating}
            ></MultilayerPerceptronNetwork>
        );
    } else if (modelParameters.networkType === "Convolutional Neural Network") {
        return (
            <ConvolutionalNeuralNetwork
                windowWidth={windowWidth}
                windowHeight={windowHeight}
                viewPortHeight={viewPortHeight}
                vhToPixel={vhToPixel}
                vwToPixel={vwToPixel}
                modelParameters={modelParameters}
                setModelParameters={setModelParameters}
                selectedLayer={selectedLayer}
                setSelectedLayer={setSelectedLayer}
                showLayerInfoBox={showLayerInfoBox}
                setShowLayerInfoBox={setShowLayerInfoBox}
                isAnimating={isAnimating}
            ></ConvolutionalNeuralNetwork>
        );
    }
}

function MultilayerPerceptronNetwork(props) {
    // window props
    const windowWidth = props.windowWidth;
    const windowHeight = props.windowHeight;
    const viewPortHeight = props.viewPortHeight;
    const vhToPixel = props.vhToPixel;
    const vwToPixel = props.vwToPixel;
    const displayedImageSrc = props.displayedImageSrc;
    const displayedPrediction = props.displayedPrediction;
    let showPrediction = displayedPrediction !== null;

    // logical props
    const modelParameters = props.modelParameters;
    const setModelParameters = props.setModelParameters;

    const selectedLayer = props.selectedLayer;
    const setSelectedLayer = props.setSelectedLayer;

    const showLayerInfoBox = props.showLayerInfoBox;
    const setShowLayerInfoBox = props.setShowLayerInfoBox;

    const isAnimating = props.isAnimating;

    // neuron clicking functionality
    const [selectedNeuron, setSelectedNeuron] = useState({
        layerId: null,
        neuronId: null,
    });
    // shift-clicking functionality
    const [leftSelectedNeuron, setLeftSelectedNeuron] = useState({
        layerId: null,
        neuronId: null,
    });
    const [rightSelectedNeuron, setRightSelectedNeuron] = useState({
        layerId: null,
        neuronId: null,
    });

    // neuronInfoBox
    const [showNeuronInfoBox, setShowNeuronInfoBox] = useState(false);
    const [neuronInfoBoxProps, setNeuronInfoBoxProps] = useState({});

    // synapseInfoBox
    const [showSynapseInfoBox, setShowSynapseInfoBox] = useState(false);
    const [synapseInfoBoxProps, setSynapseInfoBoxProps] = useState({
        leftOutput: "N/A",
        currentWeight: "N/A",
        rightInput: "N/A",
        weightHistory: [1, 2, 3],
    });

    // visual parameters - I specify these
    const neuronHeight = vhToPixel(5);
    const neuronWidth = vhToPixel(5);
    const layerHeight = vhToPixel(80);
    const layerWidth = vhToPixel(9);
    const layerTopOffset = (viewPortHeight - layerHeight) / 2;
    const layerSpacing = vwToPixel(8);
    const layerLeftOffset = (vwToPixel(100) - layerSpacing * 8) / 2 + layerWidth / 2;
    const neuronVerticalSpacing = vhToPixel(7.5);

    let layers = new Array(modelParameters.numNeuronsPerLayer.length);
    for (let i = 0; i < layers.length; i++) {
        layers[i] = (
            <MLPLayer
                setShowLayerInfoBox={setShowLayerInfoBox}
                setShowNeuronInfoBox={setShowNeuronInfoBox}
                neuronInfoBoxProps={neuronInfoBoxProps}
                setNeuronInfoBoxProps={setNeuronInfoBoxProps}
                neuronHeight={neuronHeight}
                neuronWidth={neuronWidth}
                layerHeight={layerHeight}
                layerWidth={layerWidth}
                layerTopOffset={layerTopOffset}
                layerLeftOffset={layerLeftOffset + i * layerSpacing}
                neuronVerticalSpacing={neuronVerticalSpacing}
                layerId={i}
                selectedLayerId={selectedLayer}
                setSelectedLayer={setSelectedLayer}
                // neuron click stuff
                selectedNeuron={selectedNeuron}
                setSelectedNeuron={setSelectedNeuron}
                leftSelectedNeuron={leftSelectedNeuron}
                rightSelectedNeuron={rightSelectedNeuron}
                setLeftSelectedNeuron={setLeftSelectedNeuron}
                setRightSelectedNeuron={setRightSelectedNeuron}
                setShowSynapseInfoBox={setShowSynapseInfoBox}
                numNeurons={modelParameters.numNeuronsPerLayer[i]}
                activationFunction={modelParameters.activationFunctions[i]}
                numInputs={i > 0 ? modelParameters.numNeuronsPerLayer[i - 1] : "N/A"}
                allSigmas={modelParameters.layerDisplay[i].neuronSigmas}
                allActivationOutputs={modelParameters.layerDisplay[i].neuronActivations}
                animationStates={modelParameters.layerDisplay[i].animationStates}
                key={`MLPLayer${i}`}
            />
        );
    }

    // let numSynapses = 0;
    // for (let i = 0; i < modelParameters.numNeuronsPerLayer.length - 1; i++){
    //   numSynapses += modelParameters.numNeuronsPerLayer[i] * modelParameters.numNeuronsPerLayer[i+1];
    // }
    let synapseLayers = [];
    for (let i = 0; i < modelParameters.numNeuronsPerLayer.length - 1; i++) {
        synapseLayers.push(
            <SynapseLayer
                neuronHeight={neuronHeight}
                neuronWidth={neuronWidth}
                leftLayerId={i}
                rightLayerId={i + 1}
                leftSelectedNeuron={leftSelectedNeuron}
                rightSelectedNeuron={rightSelectedNeuron}
                layerHeight={layerHeight}
                layerWidth={layerWidth}
                layerTopOffset={layerTopOffset}
                layerLeftOffset={layerLeftOffset + i * layerSpacing}
                layerSpacing={layerSpacing}
                neuronVerticalSpacing={neuronVerticalSpacing}
                numNeuronsLeft={modelParameters.numNeuronsPerLayer[i]}
                numNeuronsRight={modelParameters.numNeuronsPerLayer[i + 1]}
                animationStates={modelParameters.synapseDisplay[i].animationStates}
                leftOutputs={modelParameters.synapseDisplay[i].leftOutputs}
                rightInputs={modelParameters.synapseDisplay[i].rightInputs}
                currentWeights={modelParameters.synapseDisplay[i].currentWeights}
                weightHistories={modelParameters.synapseDisplay[i].weightHistories}
                setSynapseInfoBoxProps={setSynapseInfoBoxProps}
                key={`SynapseLayer(${i},${i + 1})`}
            ></SynapseLayer>
        );
    }

    return (
        <div className="modelViewPort">
            <svg className="svgCanvas" onClick={() => console.log("Clicked canvas but not neuron")} width={windowWidth} height={viewPortHeight}>
                {synapseLayers}
                {layers}
                {showNeuronInfoBox ? (
                    <NeuronInfoBox
                        setShowNeuronInfoBox={setShowNeuronInfoBox}
                        setNeuronInfoBoxProps={setNeuronInfoBoxProps}
                        selectedNeuron={selectedNeuron}
                        setSelectedNeuron={setSelectedNeuron}
                        height={(vhToPixel(20) * 3) / 2}
                        width={vhToPixel(20)}
                        layerSpacing={layerSpacing}
                        layerLeftOffset={layerLeftOffset}
                        layerHeight={layerHeight}
                        neuronHeight={neuronHeight}
                        neuronVerticalSpacing={neuronVerticalSpacing}
                        modelParameters={modelParameters}
                        {...neuronInfoBoxProps}
                    ></NeuronInfoBox>
                ) : null}
                {showSynapseInfoBox ? (
                    <SynapseInfoBox
                        setShowSynapseInfoBox={setShowSynapseInfoBox}
                        setSynapseInfoBoxProps={setSynapseInfoBoxProps}
                        leftSelectedNeuron={leftSelectedNeuron}
                        setLeftSelectedNeuron={setLeftSelectedNeuron}
                        rightSelectedNeuron={rightSelectedNeuron}
                        setRightSelectedNeuron={setRightSelectedNeuron}
                        height={vhToPixel(40)}
                        width={vhToPixel(40) * 0.618}
                        layerSpacing={layerSpacing}
                        layerLeftOffset={layerLeftOffset}
                        layerHeight={layerHeight}
                        neuronHeight={neuronHeight}
                        neuronVerticalSpacing={neuronVerticalSpacing}
                        modelParameters={modelParameters}
                        {...synapseInfoBoxProps}
                    ></SynapseInfoBox>
                ) : null}
                {displayedImageSrc !== null ? (
                    <image
                        className="displayedImage"
                        href={displayedImageSrc}
                        height={vhToPixel(20)}
                        width={vhToPixel(20)}
                        x={layerLeftOffset / 2 - vhToPixel(20) / 2}
                        y={viewPortHeight / 2 - vhToPixel(20) / 2}
                    ></image>
                ) : null}
            </svg>
            {/* {showNeuronInfoBox ? (
            <NeuronInfoBox
              setShowNeuronInfoBox={setShowNeuronInfoBox}
              setNeuronInfoBoxProps={setNeuronInfoBoxProps}
              setSelectedNeuron={setSelectedNeuron}
              {...neuronInfoBoxProps}
            ></NeuronInfoBox>
          ) : null} */}
            {showLayerInfoBox ? (
                <MLPLayerInfoBox
                    setShowLayerInfoBox={setShowLayerInfoBox}
                    selectedLayer={selectedLayer}
                    setSelectedLayer={setSelectedLayer}
                    modelParameters={modelParameters}
                    setModelParameters={setModelParameters}
                    isAnimating={isAnimating}
                />
            ) : null}
            {showPrediction ? (
                <div className="displayedPrediction">
                    <p
                        x={vwToPixel(100) - layerLeftOffset / 2.25}
                        y={viewPortHeight / 2 - vhToPixel(10)}
                        textAnchor="middle"
                        fontSize={vhToPixel(2.25)}
                    >
                        Network's Classification:
                    </p>
                    <p
                        x={vwToPixel(100) - layerLeftOffset / 2.25}
                        y={viewPortHeight / 2 - vhToPixel(7)}
                        textAnchor="middle"
                        fontSize={vhToPixel(1.5)}
                    >
                        (what the network thinks this is)
                    </p>
                    <h3
                        x={vwToPixel(100) - layerLeftOffset / 2.25}
                        y={viewPortHeight / 2 + vhToPixel(1)}
                        textAnchor="middle"
                        fontSize={vhToPixel(2.75)}
                        fontWeight="600"
                    >
                        {displayedPrediction}
                    </h3>
                </div>
            ) : null}
            {/* {showSynapseInfoBox ? (
            <SynapseInfoBox
              setShowSynapseInfoBox={setShowSynapseInfoBox}
              setSynapseInfoBoxProps={setSynapseInfoBoxProps}
              setLeftSelectedNeuron={setLeftSelectedNeuron}
              setRightSelectedNeuron={setRightSelectedNeuron}
              {...synapseInfoBoxProps}
            ></SynapseInfoBox>
          ) : null} */}
        </div>
    );
}

function ConvolutionalNeuralNetwork(props) {
    // window props
    const windowWidth = props.windowWidth;
    const windowHeight = props.windowHeight;
    const viewPortHeight = props.viewPortHeight;
    const vhToPixel = props.vhToPixel;
    const vwToPixel = props.vwToPixel;

    // logical props
    const modelParameters = props.modelParameters;
    const setModelParameters = props.setModelParameters;

    const selectedLayer = props.selectedLayer;
    const setSelectedLayer = props.setSelectedLayer;

    const showLayerInfoBox = props.showLayerInfoBox;
    const setShowLayerInfoBox = props.setShowLayerInfoBox;

    const isAnimating = props.isAnimating;

    // visual parameters
    const basicDepth = vhToPixel(4 * 0.707);
    const depthGrowthFactor = 0;

    const filterHeight = vhToPixel(7);
    const filterWidth = filterHeight;
    const filterVerticalSpacing = vhToPixel(13);

    const layerHeight = vhToPixel(80);
    const layerWidth = vhToPixel(9);
    const layerTopOffset = (viewPortHeight - layerHeight) / 2;
    const layerSpacing = vwToPixel(12);
    const layerLeftOffset = (vwToPixel(100) - layerSpacing * 6) / 2 + layerWidth / 2;

    const activationMapHeight = vhToPixel(10);
    const activationMapWidth = vhToPixel(10);

    const displayedImageHeight = vwToPixel(10);
    const displayedImageWidth = vwToPixel(10);

    // states
    const [animationState, setAnimationState] = useState(null);
    const [animationStateValue, setAnimationStateValue] = useState(null);

    // filter clicking functionality
    const [selectedFilter, setSelectedFilter] = useState({
        layerId: null,
        filterId: null,
    });

    const [filterInfoBoxProps, setFilterInfoBoxProps] = useState({
        selectedTile: { i: null, j: null, k: null },
        weightHistory: [1, 2, 3],
    });

    // FilterInfoBox
    const [showFilterInfoBox, setShowFilterInfoBox] = useState(false);

    useEffect(() => {
        if (animationState === "slideUpAndShrink") {
            let temp = {
                y: -layerTopOffset,
                scale: 0.6,
                originX: "center",
                originY: "center",
            };
            setAnimationStateValue(temp);
        }
        if (animationState === "default") {
            let temp = {
                y: 0,
                scale: 1,
            };
            setAnimationStateValue(temp);
        }
    }, [windowHeight, windowWidth, animationState]);

    const numLayers = modelParameters.layerInfo.length;
    let layers = new Array(numLayers);
    for (let i = 0; i < numLayers; i++) {
        // // event handlers
        const layerOnClick = () => {
            console.log(i);
            setSelectedLayer(i);
            setShowLayerInfoBox(true);
        };

        layers[i] = (
            <ConvolutionalLayer
                filterSize={modelParameters.layerInfo[i].filterSize}
                filterDepth={i > 0 ? modelParameters.layerInfo[i - 1].numFilters : 3}
                numFilters={modelParameters.layerInfo[i].numFilters}
                basicDepth={basicDepth}
                depthGrowthFactor={depthGrowthFactor}
                filterHeight={filterHeight}
                filterWidth={filterWidth}
                filterVerticalSpacing={filterVerticalSpacing}
                height={layerHeight}
                width={layerWidth}
                x={layerLeftOffset + layerSpacing * i}
                y={layerTopOffset}
                layerId={i}
                selectedLayerId={selectedLayer}
                layerOnClick={layerOnClick}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                setShowFilterInfoBox={setShowFilterInfoBox}
                key={`ConvLayer${i}`}
            />
        );
    }

    // CREATING ANIMATION COMPONENTS
    let { activationMaps, slidingFilterPages } = CreateCNNAnimationComponents(
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
    );

    let showPrediction =
        modelParameters.animationProperties.displayedPrediction !== null && modelParameters.animationProperties.displayedPrediction !== undefined;

    return (
        <div className="modelViewPort">
            {activationMaps}
            <svg className="svgCanvas" width={windowWidth} height={viewPortHeight}>
                <g className="cnnModel" animate={animationStateValue} transition={{ duration: 0.6 }}>
                    {modelParameters.animationProperties.displayedImageSrc !== null ? (
                        <image
                            className="displayedImage"
                            href={modelParameters.animationProperties.displayedImageSrc}
                            height={displayedImageHeight}
                            width={displayedImageWidth}
                            x={layerLeftOffset / 2 - displayedImageWidth / 2}
                            y={viewPortHeight / 2 - displayedImageHeight / 2}
                        ></image>
                    ) : null}
                    {layers}
                    {slidingFilterPages}
                    {showFilterInfoBox ? (
                        <FilterInfoBox
                            setShowFilterInfoBox={setShowFilterInfoBox}
                            selectedFilter={selectedFilter}
                            setSelectedFilter={setSelectedFilter}
                            height={(vhToPixel(50) * 200) / 240}
                            width={vhToPixel(50)}
                            layerSpacing={layerSpacing}
                            layerLeftOffset={layerLeftOffset}
                            layerHeight={layerHeight}
                            filterHeight={filterHeight}
                            filterWidth={filterWidth}
                            filterVerticalSpacing={filterVerticalSpacing}
                            modelParameters={modelParameters}
                            // {...filterInfoBoxProps}
                        ></FilterInfoBox>
                    ) : null}
                </g>
            </svg>
            {showLayerInfoBox ? (
                <CNNLayerInfoBox
                    setShowLayerInfoBox={setShowLayerInfoBox}
                    selectedLayer={selectedLayer}
                    setSelectedLayer={setSelectedLayer}
                    modelParameters={modelParameters}
                    setModelParameters={setModelParameters}
                    isAnimating={isAnimating}
                />
            ) : null}
            {showPrediction ? (
                <div className="displayedPrediction">
                    <p x={vwToPixel(100) - layerLeftOffset / 2.3} y={viewPortHeight / 2 - vhToPixel(10)} textAnchor="middle" fontSize={vhToPixel(2)}>
                        Network's Classification:
                    </p>
                    <p x={vwToPixel(100) - layerLeftOffset / 2.3} y={viewPortHeight / 2 - vhToPixel(7)} textAnchor="middle" fontSize={vhToPixel(1.5)}>
                        (what the network thinks this is)
                    </p>
                    <h3
                        x={vwToPixel(100) - layerLeftOffset / 2.3}
                        y={viewPortHeight / 2 + vhToPixel(1)}
                        textAnchor="middle"
                        fontSize={vhToPixel(3.5)}
                        fontWeight="600"
                    >
                        {modelParameters.animationProperties.displayedPrediction}
                    </h3>
                </div>
            ) : null}
        </div>
    );
}
