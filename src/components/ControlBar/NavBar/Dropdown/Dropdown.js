import arrow from "./arrow.svg";
import "./Dropdown.css";

export function Dropdown(props) {
  const title = props.title;
  return (
    <div className="Dropdown">
      <p>
        {title} <img src={arrow} />{" "}
      </p>
    </div>
  );
}
