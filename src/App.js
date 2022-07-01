import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { Tensor } from "./Helpers";
import useArray from "./hooks/useArray";
import { ControlBar } from "./components/ControlBar/ControlBar";

function App() {
  // states that must be communicated between ControlBar and ModelViewPort must be stored here
  const [modelParameters, setModelParameters] = useState({
    type: "mlp",
    numLayers: "0",
    numNeuronsPerLayer: [],
    activationFunctions: [],
  });
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [selectedNeuron, setSelectedNeuron] = useState(null);
  const [showTutorial, toggleShowTutorial] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState("Average");
  const [preset, setPreset] = useState(null);

  // test function and states for fetching data
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  async function ProcessResponse() {
    let resp = await fetch("http://localhost:3001/", { mode: "cors" }).then((resp) => resp.json());
    setLoading(false);
    let epochs = resp.map((e) => {
      return {
        activationMaps: e.activationMaps.map((tensor) => {
          return new Tensor(
            tensor.dims.map((num) => Number(num)),
            tensor.values.map((num) => Number(num))
          );
        }),
      };
    });

    setData(epochs);

    console.log(epochs[0].activationMaps[0].get([0, 0, 0, 0]));
  }

  return (
    <div className="App">
      <ControlBar modelParameters={modelParameters}></ControlBar>
    </div>
  );
}

export default App;
