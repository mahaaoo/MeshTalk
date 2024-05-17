import React from "react";
import { Line, Svg } from "react-native-svg";

import Colors from "../../config/colors";
import useDeviceStore from "../../store/useDeviceStore";

interface SplitLineProps {
  color?: string;
  start: number;
  end: number;
  width?: number;
  type?: "Vertical" | "Horizontal";
}

const SplitLine: React.FC<SplitLineProps> = (props) => {
  const {
    color = Colors.defaultLineGreyColor,
    start = 0,
    end = 0,
    type = "Horizontal",
    width = 1,
  } = props;
  const { height: deviceHeight, width: deviceWidth } = useDeviceStore();

  if (type === "Vertical") {
    return (
      <Svg height={deviceHeight} width={width}>
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
    <Svg height={width} width={deviceWidth}>
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

export default SplitLine;
