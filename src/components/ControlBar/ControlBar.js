import { useState, useEffect } from "react";
import { NavBar } from "./NavBar/NavBar";
import { NetworkInfoBar } from "./NetworkInfoBar/NetworkInfoBar";

export function ControlBar(props) {
  const modelParameters = props.modelParameters;
  const setModelParameters = props.setModelParameters;

  return (
    <div className="controlBar">
      <NavBar modelParameters={modelParameters} setModelParameters={setModelParameters}></NavBar>
      <NetworkInfoBar modelParameters={modelParameters}></NetworkInfoBar>
    </div>
  );
}
