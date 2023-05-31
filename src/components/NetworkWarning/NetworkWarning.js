import "./NetworkWarning.css";
import warningTriangle from "../../resources/warningTriangle.svg";

export function NetworkWarning(props) {
  const setLoadingStatus = props.setLoadingStatus;

  return (
    <div className="parameterWarningMessage">
      <h1>Network Error!</h1>
      <img src={warningTriangle} alt="Warning Triangle Icon" />
      <p className="parameterWarningMessageParagraph">Something went wrong with retrieving the trained model's data from the backend!</p>
      <div
        className="parameterWarningDismissButton"
        onClick={() => {
          setLoadingStatus({ status: null, showWarning: false });
        }}
      >
        <p>Dismiss</p>
      </div>
    </div>
  );
}
