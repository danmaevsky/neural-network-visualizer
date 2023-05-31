import "./LoadingMessage.css";

export function LoadingMessage(props) {
    const { loadingStatus, setLoadingStatus, animationQueue } = props;

    const playButtonOnClick = () => {
        setLoadingStatus({ status: null, showWarning: false });
        animationQueue.animate();
    };

    if (loadingStatus.status === "done") {
        return (
            <div className="loadingMessage-done">
                <h2>Done Training!</h2>
                <LoadingIcon />
                <h3>Click the button below to start the animation.</h3>
                <button onClick={playButtonOnClick}>Play</button>
            </div>
        );
    }
    return (
        <div className="loadingMessage">
            <h2>Training and Loading Model...</h2>
            <LoadingIcon />
            <h3>This may take a while!</h3>
            <h3>Grab a cup of coffee, relax.</h3>
            <h3>I'll let you know when it's finished 😀</h3>
        </div>
    );
}

function LoadingIcon() {
    return (
        <svg
            id="Neural_Network_Icon"
            data-name="Neural Network Icon"
            xmlns="http://www.w3.org/2000/svg"
            width="100"
            height="100"
            viewBox="0 0 100 100"
        >
            <circle id="N1_1_Shadow" data-name="N1,1 Shadow" cx="7.5" cy="7.5" r="7.5" transform="translate(15 9)" fill="#cfffd1" />
            <circle id="N2_1_Shadow" data-name="N2,1 Shadow" cx="7.5" cy="7.5" r="7.5" transform="translate(15 43)" fill="#cfecff" />
            <circle id="N3_1_Shadow" data-name="N3,1 Shadow" cx="7.5" cy="7.5" r="7.5" transform="translate(15 77)" fill="#ffd9cf" />
            <circle id="N2_2_Shadow" data-name="N2,2 Shadow" cx="8.5" cy="8.5" r="8.5" transform="translate(65 61)" fill="#dccfff" />
            <circle id="N1_2_Shadow" data-name="N1,2 Shadow" cx="8.5" cy="8.5" r="8.5" transform="translate(65 26)" fill="#ffcff2" />
            <path
                id="Path_51"
                data-name="Path 51"
                d="M32.672,17.011,75.872,67.234"
                fill="none"
                stroke="#707070"
                strokeLinecap="round"
                strokeWidth="2"
            />
            <path
                id="Path_50"
                data-name="Path 50"
                d="M32.672,49.953,75.872,33.212"
                fill="none"
                stroke="#707070"
                strokeLinecap="round"
                strokeWidth="2"
            />
            <path
                id="Path_49"
                data-name="Path 49"
                d="M32.672,49.953,75.872,67.234"
                fill="none"
                stroke="#707070"
                strokeLinecap="round"
                strokeWidth="2"
            />
            <path
                id="Path_48"
                data-name="Path 48"
                d="M32.672,83.435,75.872,33.212"
                fill="none"
                stroke="#707070"
                strokeLinecap="round"
                strokeWidth="2"
            />
            <path
                id="Path_47"
                data-name="Path 47"
                d="M32.672,83.435,75.872,67.234"
                fill="none"
                stroke="#707070"
                strokeLinecap="round"
                strokeWidth="2"
            />
            <path
                id="Path_46"
                data-name="Path 46"
                d="M32.672,16.471,75.872,33.212"
                fill="none"
                stroke="#707070"
                strokeLinecap="round"
                strokeWidth="2"
            />
            <circle className="loadingDataOrb11" fill="#97d4ff" stroke="#4ea0fe" r="3"></circle>
            <circle className="loadingDataOrb12" fill="#97d4ff" stroke="#4ea0fe" r="3"></circle>
            <circle className="loadingDataOrb21" fill="#97d4ff" stroke="#4ea0fe" r="3"></circle>
            <circle className="loadingDataOrb22" fill="#97d4ff" stroke="#4ea0fe" r="3"></circle>
            <circle className="loadingDataOrb31" fill="#97d4ff" stroke="#4ea0fe" r="3"></circle>
            <circle className="loadingDataOrb32" fill="#97d4ff" stroke="#4ea0fe" r="3"></circle>
            <g id="Icon_Neuron_1_1" data-name="Icon Neuron 1,1" transform="translate(17 7)" fill="#fff" stroke="#707070" strokeWidth="1">
                <circle cx="8" cy="8" r="8" stroke="none" />
                <circle cx="8" cy="8" r="7.5" fill="none" />
            </g>
            <g id="Icon_Neuron_2_1" data-name="Icon Neuron 2,1" transform="translate(17 42)" fill="#fff" stroke="#707070" strokeWidth="1">
                <circle cx="8" cy="8" r="8" stroke="none" />
                <circle cx="8" cy="8" r="7.5" fill="none" />
            </g>
            <g id="Icon_Neuron_3_1" data-name="Icon Neuron 3,1" transform="translate(17 76)" fill="#fff" stroke="#707070" strokeWidth="1">
                <circle cx="8" cy="8" r="8" stroke="none" />
                <circle cx="8" cy="8" r="7.5" fill="none" />
            </g>
            <g id="Icon_Neuron_2_2" data-name="Icon Neuron 2,2" transform="translate(67 60)" fill="#fff" stroke="#707070" strokeWidth="1">
                <circle cx="8" cy="8" r="8" stroke="none" />
                <circle cx="8" cy="8" r="7.5" fill="none" />
            </g>
            <g id="Icon_Neuron_1_2" data-name="Icon Neuron 1,2" transform="translate(67 25)" fill="#fff" stroke="#707070" strokeWidth="1">
                <circle cx="8" cy="8" r="8" stroke="none" />
                <circle cx="8" cy="8" r="7.5" fill="none" />
            </g>
        </svg>
    );
}
