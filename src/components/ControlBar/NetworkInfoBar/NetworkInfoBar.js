import { useState, useEffect } from "react";
import "./NetworkInfoBar.css";

export function NetworkInfoBar(props) {
  const modelParameters = props.modelParameters;
  const networkType = modelParameters.networkType;
  const dataset = modelParameters.dataset;
  const numLayers = modelParameters.numNeuronsPerLayer.length;
  const numNeurons = modelParameters.numNeuronsPerLayer.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  const checkIsDefined = (s) => {
    return s !== null && s !== undefined ? s : "Not Defined Yet";
  };

  return (
    <div className="NetworkInfoBar">
      <div className="networkInfoBarTextArea">
        <h1>Network Information</h1>
        <div className="networkInfoBarText networkInfoBarTextAreaColumn1">
          <div>
            <p>{`Network Type:`}</p>
            <p>{`Dataset:`}</p>
          </div>
          <div>
            <p>{checkIsDefined(networkType)}</p>
            <p>{checkIsDefined(dataset)}</p>
          </div>
        </div>
        <div className="networkInfoBarText networkInfoBarTextAreaColumn2">
          <div>
            <p>{`Layers:`}</p>
            <p>{`Nodes:`}</p>
          </div>
          <div>
            <p>{checkIsDefined(numLayers)}</p>
            <p>{checkIsDefined(numNeurons)}</p>
          </div>
        </div>
        <div className="networkInfoBarText networkInfoBarTextAreaColumn3">
          <div>
            <p>{`Validation Accuracy:`}</p>
            <p>{`Test Accuracy:`}</p>
          </div>
          <div>
            <p>{checkIsDefined("98%")}</p>
            <p>{checkIsDefined("20%")}</p>
          </div>
        </div>
      </div>
      <div className="visualizeButton">
        <p>Visualize</p>
      </div>
    </div>
  );
}
