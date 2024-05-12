/**
 * 根据ScrollView或者FlatList等组件，下拉动作显示的Loading
 */
import React, { memo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface PullLoadingProps {
  refreshing: SharedValue<boolean>;
  scrollY: any;
  top: number;
  left: number;
  offsetY: number;
  size?: number;
}

const PullLoading: React.FC<PullLoadingProps> = memo((props) => {
  const { refreshing, scrollY, top, size = 30, offsetY } = props;

  const animatedStyle = useAnimatedStyle(() => {
    if (!refreshing.value) {
      return {
        opacity: interpolate(-scrollY.value, [-offsetY, 0], [1, 0]),
      };
    } else {
      return {
        opacity: 1,
      };
    }
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          top: top - size / 2,
          right: 20,
        },
        animatedStyle,
      ]}
    >
      <ActivityIndicator color="#fff" />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PullLoading;
