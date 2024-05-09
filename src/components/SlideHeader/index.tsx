/**
 * 根据ScrollView或者FlatList等组件，上滑动作，逐渐显示的Header标题头
 */

import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import Screen from "../../config/screen";

interface SlideHeaderProps {
  width?: number;
  height: number;
  scrollY: SharedValue<number>;
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        -scrollY.value,
        [0, offsetY / 2, offsetY],
        [0, 0.3, 1],
        Extrapolation.CLAMP,
      ),
    }
  })

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          height,
        },
        animatedStyle,
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
