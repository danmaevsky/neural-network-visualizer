import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import useArray from "./hooks/useArray";

function App() {
  let [arr, arrMethods] = useArray(["a", "b", "c"]);

  let loopExample = () => {
    for (let i = 0; i < arr.length; i++) {
      arrMethods.update(i, 2 * i + 1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        {arr}
        <button onClick={loopExample}>Click to run loopExample</button>
      </header>
    </div>
  );
}

export default App;
