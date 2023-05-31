import { useEffect, useState, useRef, useCallback } from "react";
import { useToggle } from "../../../../hooks/useToggle.js";
import "./Dropdown.css";

export function Dropdown(props) {
  // props
  const title = props.title;
  const selection = props.selection;
  const onSelect = props.onSelect;
  const menuItems = props.menuItems;
  const isEnabled = props.isEnabled;
  const willGlow = props.willGlow !== undefined ? props.willGlow : false;

  // important states for dropdown component. isExpanded := opened or closed? selection := current item selected
  const [isExpanded, toggleExpanded] = useToggle(false);

  // open the dropdown if it was closed, or blur the dropdown if it was open (leading it to close)
  const dropdownHandleClick = (e) => {
    if (isExpanded) {
      e.currentTarget.blur();
    } else {
      toggleExpanded();
    }
  };
  // change current selection when clicking on a menuItem
  const itemHandleClick = (event) => {
    let s = event.target.innerText;
    if (s === selection) {
      onSelect(null);
    } else {
      onSelect(s);
    }
    event.stopPropagation();
  };
  // close the dropdown when it loses focus (e.g. clicking outside of the element)
  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      toggleExpanded(false);
    }
  };

  if (isEnabled) {
    return (
      <div
        className={willGlow && selection !== null ? "dropdownGlow" : "dropdown"}
        tabIndex={-1}
        onBlur={(e) => onClickOutside(e)}
        onClick={(e) => dropdownHandleClick(e)}
      >
        <div className="dropdownTitle">
          <p>
            {title} <DropArrow />
          </p>
        </div>
        {isExpanded ? (
          <div className="menuItems">
            {menuItems.map((s) => {
              return (
                <div className={s === selection ? "selectedItem" : "menuItem"} key={s} onClick={(e) => itemHandleClick(e)}>
                  <p>{s}</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
  if (!isEnabled) {
    return (
      <div className="disabledDropdown">
        <div className="dropdownTitle">
          <p>
            {title} <DropArrow />
          </p>
        </div>
      </div>
    );
  }
}

// dropArrow defined as SVG to allow CSS styling
function DropArrow() {
  return (
    <svg className="arrowDown" xmlns="http://www.w3.org/2000/svg" width="11.56" height="6.894" viewBox="0 0 11.56 6.894">
      <path
        id="Icon_ionic-md-arrow-dropdown"
        data-name="Icon ionic-md-arrow-dropdown"
        d="M9,13.5l5.78,6.894L20.56,13.5Z"
        transform="translate(-9 -13.5)"
        fill="#fff"
      />
    </svg>
  );
}
