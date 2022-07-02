import { useState, useEffect } from "react";
import "./NavBar.css";
import { Dropdown } from "./Dropdown/Dropdown";
import logo from "./logo.svg";

export function NavBar(props) {
  const modelParameters = props.modelParameters;
  const setModelParameters = props.setModelParameters;
  const presetsDropdownItems = ["MNIST-MLP", "MNIST-CNN", "CIFAR-10-MLP", "CIFAR-10-CNN"];
  const presetsOnSelect = (selection) => {
    let temp = structuredClone(modelParameters);
    temp.preset = selection;
    setModelParameters(temp);
    return;
  };
  const datasetsDropdownItems = ["MNIST", "CIFAR-10", "Iris", "Gems"];
  const datasetsOnSelect = (selection) => {
    let temp = structuredClone(modelParameters);
    temp.dataset = selection;
    setModelParameters(temp);
    return;
  };
  const algoDropdownItems = ["Multilayer Perceptron Network", "Convolutional Neural Network", "Recurrent Neural Network"];
  const algoOnSelect = (selection) => {
    let temp = structuredClone(modelParameters);
    temp.networkType = selection;
    setModelParameters(temp);
    return;
  };
  const speedDropdownItems = ["Slow", "Average", "Fast"];
  const speedOnSelect = () => null;
  const clearBoard = () => null;

  return (
    <div className="NavBar">
      <div className="navbarLeft">
        <Logo></Logo>
        <h1 className="appTitle">Neural Network Visualizer</h1>
      </div>
      <div className="buttonsAndDropdowns">
        <Dropdown title="Presets" menuItems={presetsDropdownItems} onSelect={presetsOnSelect}></Dropdown>
        <Dropdown title="Datasets" menuItems={datasetsDropdownItems} onSelect={datasetsOnSelect}></Dropdown>
        <Dropdown title="Algorithms" menuItems={algoDropdownItems} onSelect={algoOnSelect}></Dropdown>
        <Dropdown title="Speed" menuItems={speedDropdownItems} onSelect={speedOnSelect}></Dropdown>
        <ClearBoardButton callback={clearBoard}></ClearBoardButton>
      </div>
      <HamburgerButton />
    </div>
  );
}

function Logo() {
  return <img src={logo} />;
}

function HamburgerButton() {
  const [hoverState, setHoverState] = useState("steadyStateHamburger");
  return (
    <svg
      className="hamburgerButton"
      onMouseEnter={() => setHoverState("mouseOverHamburger")}
      xmlns="http://www.w3.org/2000/svg"
      width="39"
      height="34"
      viewBox="0 0 39 34"
    >
      <defs>
        <clipPath id="clipPath">
          <rect width="39" height="34" fill="none" />
        </clipPath>
      </defs>
      <g id="Repeat_Grid_1" data-name="Repeat Grid 1" clipPath="url(#clipPath)">
        <g transform="translate(-1634 -27)">
          <g id="Rectangle_11" data-name="Rectangle 11" transform="translate(1634 27)" fill="#fff" stroke="#000" strokeWidth="1">
            <rect width="39" height="8" stroke="none" />
            <rect x="0.5" y="0.5" width="38" height="7" fill="none" />
          </g>
        </g>
        <g transform="translate(-1634 -14)">
          <g id="Rectangle_11-2" data-name="Rectangle 11" transform="translate(1634 27)" fill="#fff" stroke="#000" strokeWidth="1">
            <rect width="39" height="8" stroke="none" />
            <rect x="0.5" y="0.5" width="38" height="7" fill="none" />
          </g>
        </g>
        <g transform="translate(-1634 -1)">
          <g id="Rectangle_11-3" data-name="Rectangle 11" transform="translate(1634 27)" fill="#fff" stroke="#000" strokeWidth="1">
            <rect width="39" height="8" stroke="none" />
            <rect x="0.5" y="0.5" width="38" height="7" fill="none" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function ClearBoardButton(props) {
  const callback = props.callback;
  return (
    <div className="clearBoard" onClick={callback}>
      <p>Clear Board</p>
    </div>
  );
}
