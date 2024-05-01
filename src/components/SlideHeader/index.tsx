/**
 * 根据ScrollView或者FlatList等组件，上滑动作，逐渐显示的Header标题头
 */

import React from "react";
import { Animated, StyleSheet } from "react-native";

import Screen from "../../config/screen";

interface SlideHeaderProps {
  width?: number;
  height: number;
  scrollY: any;
  offsetY?: number;
  children: React.ReactNode;
}

const SlideHeader: React.FC<SlideHeaderProps> = (props) => {
  const {
    children,
    width = Screen.width,
    height,
    scrollY,
    offsetY = height,
  } = props;
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          height,
          opacity: scrollY.interpolate({
            inputRange: [0, offsetY / 2, offsetY],
            outputRange: [0, 0.3, 1],
            extrapolate: "clamp",
          }),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SlideHeader;
