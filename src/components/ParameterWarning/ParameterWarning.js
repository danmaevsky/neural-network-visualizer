import "./ParameterWarning.css";
import warningTriangle from "../../resources/warningTriangle.svg";

export function ParameterWarning(props) {
  const status = props.status;
  const setParameterWarning = props.setParameterWarning;
  let message = "";
  switch (status.problem) {
    case "dataset":
      message = (
        <p className="parameterWarningMessageParagraph">
          You have not chosen a <b>Dataset</b>. Please choose a <b>Dataset</b> from the dropdown menu at the top and try again!
        </p>
      );
      break;
    case "numLayersTooBig":
      message = (
        <p className="parameterWarningMessageParagraph">
          There are too many layers in your model. This error really shouldn't happen, so try refreshing the page and try again!
        </p>
      );
      break;
    case "numLayersTooSmall":
      message = (
        <p className="parameterWarningMessageParagraph">
          There are not enough layers in your model. Please use the <b>Add Layer</b> button in the Network Information bar to add at least one layer
          and try again!
        </p>
      );
      break;
    case "activationFunction":
      message = (
        <p className="parameterWarningMessageParagraph">
          There is no <b>Activation Function</b> set for <b>Layer {`${status.layer}`}</b>. Please select an <b>Activation Function</b> from the Layer
          Properties menu by clicking on that layer and try again!
        </p>
      );
      break;
    case "numFiltersTooSmall":
      message = (
        <p className="parameterWarningMessageParagraph">
          There are too few Filters <b>({`${status.numFilters}`})</b> in <b>Layer {`${status.layer}`}</b>. This error really shouldn't happen, so try
          refreshing the page and try again!
        </p>
      );
      break;
    case "numFiltersTooBig":
      message = (
        <p className="parameterWarningMessageParagraph">
          There are too many Filters <b>({`${status.numFilters}`})</b> in <b>Layer {`${status.layer}`}</b>. This error really shouldn't happen, so try
          refreshing the page and try again!
        </p>
      );
      break;
    case "filterSizeTooSmall":
      message = (
        <p className="parameterWarningMessageParagraph">
          The filters in <b>Layer {`${status.layer}`}</b> are too small <b>({`${status.filterSize}x${status.filterSize}`})</b>. This error really
          shouldn't happen, so try refreshing the page and try again!`;
        </p>
      );
      break;
    case "filterSizeTooBig":
      message = (
        <p className="parameterWarningMessageParagraph">
          The filters in <b>Layer {`${status.layer}`}</b> are too big <b>({`${status.filterSize}x${status.filterSize}`})</b>. This error really
          shouldn't happen, so try refreshing the page and try again!`;
        </p>
      );
      break;
    case "numNeuronsTooSmall":
      message = (
        <p className="parameterWarningMessageParagraph">
          There are too few Neurons <b>({`${status.numFilters}`})</b> in <b>Layer {`${status.layer}`}</b>. This error really shouldn't happen, so try
          refreshing the page and try again!
        </p>
      );
      break;
    case "numNeuronsTooBig":
      message = (
        <p className="parameterWarningMessageParagraph">
          There are too many Neurons <b>({`${status.numFilters}`})</b> in <b>Layer {`${status.layer}`}</b>. This error really shouldn't happen, so try
          refreshing the page and try again!
        </p>
      );
      break;
    default:
      message = (
        <p className="parameterWarningMessageParagraph">
          Some kind of error happened with your parameters! This error message really shouldn't appear, so try refreshing the page and try again!
        </p>
      );
  }

  return (
    <div className="parameterWarningMessage">
      <h1>Invalid Parameters!</h1>
      <img src={warningTriangle} alt="Warning Triangle Icon" />
      {message}
      <div
        className="parameterWarningDismissButton"
        onClick={() => {
          setParameterWarning({ status: null, showWarning: false });
        }}
      >
        <p>Dismiss</p>
      </div>
    </div>
  );
}
