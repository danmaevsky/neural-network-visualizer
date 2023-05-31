import "./Filter.css";

export function Filter(props) {
  const color = props.color;
  const x = props.x;
  const y = props.y;
  const filterHeight = props.filterHeight;
  const filterWidth = props.filterWidth;
  const popOrSlide = props.popOrSlide;
  const filterId = props.filterId;
  const layerId = props.layerId;
  const selectedFilter = props.selectedFilter;
  const setSelectedFilter = props.setSelectedFilter;
  const setShowFilterInfoBox = props.setShowFilterInfoBox;

  const selectCircleRatio = 1.4;
  const isSelected = selectedFilter.layerId === layerId && selectedFilter.filterId === filterId;

  const handleClick = (e) => {
    console.log(`Clicked filter L${layerId},F${filterId}`);
    setSelectedFilter({
      layerId: layerId,
      filterId: filterId,
    });
    setShowFilterInfoBox(true);
    e.stopPropagation();
  };

  return (
    <g onClick={handleClick} className={`${color}Filter ${popOrSlide} filter`}>
      {isSelected ? <FilterSelectCircle height={filterHeight} width={filterWidth} x={x} y={y} circleRatio={selectCircleRatio} /> : null}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.11 150.16" height={filterHeight} width={filterWidth} x={x} y={y}>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_2-2" data-name="Layer 2">
            <polygon className="cls-1" points="65.06 149.91 129.86 112.5 129.86 37.67 65.06 75.08 65.06 149.91" />
            <line className="cls-2" x1="129.86" y1="112.5" x2="65.06" y2="75.08" />
            <polygon className="cls-3" points="65.06 149.91 0.25 112.5 0.25 37.67 65.06 75.08 65.06 149.91" />
            <line className="cls-2" x1="0.25" y1="112.49" x2="65.06" y2="75.08" />
            <polygon className="cls-4" points="0.25 37.67 65.06 0.25 129.86 37.67 65.06 75.08 0.25 37.67" />
            <line className="cls-2" x1="65.06" y1="0.25" x2="65.06" y2="75.08" />
            <g className="innerCube">
              <polygon className="cls-5" points="65.06 129.01 111.76 102.05 111.76 48.12 65.06 75.08 65.06 129.01" />
              <polygon className="cls-6" points="65.06 129.01 18.35 102.05 18.35 48.12 65.06 75.08 65.06 129.01" />
              <polygon className="cls-7" points="18.35 48.12 65.06 21.15 111.76 48.12 65.06 75.08 18.35 48.12" />
            </g>
            <line className="cls-8" x1="65.06" y1="149.91" x2="65.06" y2="75.08" />
            <line className="cls-8" x1="129.86" y1="37.67" x2="65.06" y2="75.08" />
            <line className="cls-8" x1="0.25" y1="37.67" x2="65.06" y2="75.08" />
          </g>
        </g>
      </svg>
    </g>
  );
}

function FilterSelectCircle(props) {
  const height = props.height;
  const width = props.width;
  const x = props.x;
  const y = props.y;
  const circleRatio = props.circleRatio;

  return (
    <svg
      viewBox="0 0 100 100"
      width={width * circleRatio}
      height={height * circleRatio}
      x={x - (width * (circleRatio - 1)) / 2}
      y={y - (height * (circleRatio - 1)) / 2}
    >
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="0" stopColor="#ff0"></stop>
          <stop offset=".5" stopColor="#f0f"></stop>
          <stop offset="1" stopColor="#ff0"></stop>
        </linearGradient>
        <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" begin="0s" dur="1.5s" repeatCount="indefinite" />
      </defs>
      <mask id="hexagonMask">
        <polygon className="hexagonMask" stroke="white" points="50,5 88.97,27.5 88.97,72.5 50,95 11.03,72.5 11.03,27.5" />
      </mask>
      <circle className="filterSelectCircle" cx="50" cy="50" r="45" fill="none" stroke="url(#myGradient)" mask="url(#hexagonMask)" />
    </svg>
  );
}
