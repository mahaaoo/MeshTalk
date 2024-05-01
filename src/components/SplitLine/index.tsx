import React from "react";
import { Line, Svg } from "react-native-svg";

import Colors from "../../config/colors";
import Screen from "../../config/screen";

interface SplitLineProps {
  color?: string;
  start: number;
  end: number;
  width?: number;
  type?: "Vertical" | "Horizontal";
}

const SplitLine: React.FC<SplitLineProps> = (props) => {
  const { color, start, end, type, width } = props;

  if (type === "Vertical") {
    return (
      <Svg height={Screen.height} width={width}>
        <Line
          x1="0"
          y1={start}
          x2="0"
          y2={end}
          stroke={color}
          strokeWidth={width}
        />
      </Svg>
    );
  }
  return (
    <Svg height={width} width={Screen.width}>
      <Line
        x1={start}
        y1="0"
        x2={end}
        y2="0"
        stroke={color}
        strokeWidth={width}
      />
    </Svg>
  );
};

SplitLine.defaultProps = {
  color: Colors.defaultLineGreyColor,
  start: 0,
  end: 0,
  type: "Horizontal",
  width: 1,
};

export default SplitLine;
