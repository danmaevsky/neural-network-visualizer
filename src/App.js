import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { Tensor } from "./Helpers";
import useArray from "./hooks/useArray";
import { ControlBar } from "./components/ControlBar/ControlBar";
import { ModelViewPort } from "./components/ModelViewPort/ModelViewPort";

function App() {
  // states that must be communicated between ControlBar and ModelViewPort must be stored here
  const [modelParameters, setModelParameters] = useState({
    networkType: null,
    dataset: null,
    numNeuronsPerLayer: [0],
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
      <ControlBar modelParameters={modelParameters} setModelParameters={setModelParameters}></ControlBar>
      <ModelViewPort />
    </div>
  );
}

export default App;
