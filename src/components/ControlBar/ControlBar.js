import { useState, useEffect } from "react";
import { NavBar } from "./NavBar/NavBar";
import { NetworkInfoBar } from "./NetworkInfoBar/NetworkInfoBar";

export function ControlBar(props) {
  const modelParameters = props.modelParameters;

  return (
    <div>
      <NavBar></NavBar>
      <NetworkInfoBar
        networkType={modelParameters.type}
        numLayers={modelParameters.numLayers}
        numNeuronsPerLayer={modelParameters.numNeuronsPerLayer}
      ></NetworkInfoBar>
    </div>
  );
}
