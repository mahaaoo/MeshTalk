/**
 * 根据ScrollView或者FlatList等组件，下拉动作显示的Loading
 */
import React, { useMemo, useEffect, memo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface PullLoadingProps {
  refreshing: boolean;
  scrollY: any;
  top: number;
  left: number;
  offsetY: number;
  size?: number;
  onRefresh?: () => void;
}

const PullLoading: React.FC<PullLoadingProps> = memo((props) => {
  const {
    refreshing,
    scrollY,
    top,
    left,
    size = 30,
    offsetY,
    onRefresh,
  } = props;

  const opacity = useSharedValue(0);

  const optatus = useMemo(() => {
    if (!refreshing) {
      return interpolate(-scrollY.value, [-offsetY, 0], [1, 0]);
    } else {
      return 1;
    }
  }, [scrollY, refreshing]);

  useEffect(() => {
    if (refreshing) {
      onRefresh && onRefresh();
    }
  }, [refreshing]);

  const animatedStyle = useAnimatedStyle(() => {
    if (!refreshing) {
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
          left: left - size / 2,
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
