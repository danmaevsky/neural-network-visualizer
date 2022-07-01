import { useState, useEffect } from "react";
import "./NetworkInfoBar.css";

export function NetworkInfoBar(props) {
  const networkTypes = {
    mlp: "Multilayer Perceptron",
  };
  const networkType = networkTypes[props.networkType];
  const numLayers = props.numLayers;
  const numNeurons = props.numNeuronsPerLayer.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  return (
    <div className="NetworkInfoBar">
      <div className="networkInfoBarTextArea">
        <h1>Network Information</h1>
        <div className="networkInfoBarText">
          <p>{`Network Type: ${networkType}`}</p>
          <p>{`Layers: ${numLayers}`}</p>
        </div>
        <div className="networkInfoBarText">
          <p>{`Nodes/Filters: ${numNeurons}`}</p>
          <p>{`Test Accuracy: 32%`}</p>
        </div>
        <div className="networkInfoBarText">
          <p>{`Validation Accuracy: 98%`}</p>
        </div>
      </div>
    </div>
  );
}
