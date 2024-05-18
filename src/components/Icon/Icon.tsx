import React from "react";
import Svg, { Path } from "react-native-svg";

import { Library } from "./library";

interface IconProps {
  name: keyof typeof Library;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = (props) => {
  const { name, size = 20, color = "black" } = props;
  const paths = Library[name];

  if (Array.isArray(paths)) {
    return (
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        {paths.map((path, index) => (
          <Path key={index} d={path} fill={color} />
        ))}
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      <Path d={Library[name] as string} fill={color} />
    </Svg>
  );
};

export default Icon;
