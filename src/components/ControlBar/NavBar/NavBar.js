import { useState, useEffect } from "react";
import "./NavBar.css";
import { Dropdown } from "./Dropdown/Dropdown";
import logo from "./logo.svg";
import hamburgerButton from "./hamburgerButton.svg";

export function NavBar(props) {
  const presetsDropdownItems = [];
  const presetsOnSelect = () => null;
  const algoDropdownItems = [];
  const algoOnSelect = () => null;
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
        <Dropdown title="Presets" items={presetsDropdownItems} onSelect={presetsOnSelect}></Dropdown>
        <Dropdown title="Algorithms" items={algoDropdownItems} onSelect={algoOnSelect}></Dropdown>
        <Dropdown title="Speed" items={speedDropdownItems} onSelect={speedOnSelect}></Dropdown>
        <div>
          <p className="clearBoardButton" onClick={clearBoard}>
            Clear Board
          </p>
        </div>
      </div>
      <img className="hamburgerButton" src={hamburgerButton} />
    </div>
  );
}

function Logo() {
  return <img src={logo} />;
}
