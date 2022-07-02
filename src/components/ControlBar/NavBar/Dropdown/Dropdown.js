import { useEffect, useState, useRef, useCallback } from "react";
import { useToggle } from "../../../../hooks/useToggle.js";
import arrow from "./arrow.svg";
import "./Dropdown.css";

export function Dropdown(props) {
  // props
  const title = props.title;
  const onSelect = props.onSelect;
  const menuItems = props.menuItems;

  // important states for dropdown component. isExpanded := opened or closed? selection := current item selected
  const [isExpanded, toggleExpanded] = useToggle(false);
  const [selection, setSelection] = useState(null);

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
    setSelection(event.target.innerText);
    event.stopPropagation();
  };
  // close the dropdown when it loses focus (e.g. clicking outside of the element)
  const onClickOutside = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      toggleExpanded(false);
    }
  };

  // handling change of selection
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    } else {
      onSelect(selection);
    }
  }, [selection]);

  return (
    <div className="dropdown" tabIndex={-1} onBlur={(e) => onClickOutside(e)} onClick={(e) => dropdownHandleClick(e)}>
      <div className="dropdownTitle" autoFocus>
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
