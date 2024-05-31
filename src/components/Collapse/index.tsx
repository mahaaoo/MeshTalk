import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  useAnimatedRef,
  runOnUI,
  measure,
} from "react-native-reanimated";

import { Icon } from "../Icon";

interface CollapseProps {
  title: string;

  active?: boolean;
  onChange?: () => void;

  children: React.ReactNode;
}

const Collapse: React.FC<CollapseProps> = (props) => {
  const { children, title, onChange, active = false } = props;

  const open = useSharedValue(active);
  const height = useSharedValue(0);
  const transition = useDerivedValue(() => {
    return open.value === true ? withTiming(1) : withTiming(0);
  });

  const animatedRef = useAnimatedRef();

  useEffect(() => {
    runOnUI(() => {
      const measurement = measure(animatedRef);
      if (measurement === null) {
        return;
      }
      console.log("handleLayout", measurement);
      // ...
    })();
  }, []);
  // const handleLayout = useCallback((e: any) => {
  //   const { height: h } = e.nativeEvent.layout;
  //   height.value = h;
  //   console.log("handleLayout", h);
  // }, []);

  const handleOnPress = useCallback(() => {
    "worklet";
    runOnUI(() => {
      const measurement = measure(animatedRef);
      if (measurement === null) {
        return;
      }
      console.log("handleLayout", measurement);
      // ...
    })();

    open.value = !open.value;
    onChange && runOnJS(onChange)();
  }, [onChange, open]);

  const style = useAnimatedStyle(() => {
    return {
      height: transition.value * height.value + 1,
      opacity: transition.value === 0 ? 0 : 1,
    };
  }, [height]);

  const arrowStyle = useAnimatedStyle(() => {
    const degress = interpolate(
      transition.value,
      [0, 1],
      [0, 90],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        {
          rotateZ: `${degress}deg`,
        },
      ],
    };
  });

  const handleLayout = useCallback((e: any) => {
    const { height: h } = e.nativeEvent.layout;
    console.log("handleLayout", h);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Animated.View style={arrowStyle}>
            <Icon name="arrowDown" />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.items, style]}>
        <View onLayout={handleLayout}>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  titleContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  items: {
    overflow: "hidden",
  },
});

export default Collapse;
