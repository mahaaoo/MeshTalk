/**
 * 吸附在设定的距离的顶吸组件
 */

import React, { useCallback, useMemo, memo, useState } from "react";
import { Animated, ViewStyle, StyleSheet } from "react-native";

interface StickyHeaderProps {
  stickyHeaderY: number;
  stickyScrollY: any;
  children: React.ReactNode;
  style?: ViewStyle;
  onLayout?: (event: any) => void;
}

const StickyHeader: React.FC<StickyHeaderProps> = memo((props) => {
  const {
    stickyHeaderY,
    stickyScrollY,
    children,
    style,
    onLayout,
    ...otherProps
  } = props;

  const [stickyLayoutY, setStickyLayoutY] = useState(0);

  const _onLayout = useCallback(
    (event: {
      nativeEvent: { layout: { y: React.SetStateAction<number> } };
    }) => {
      if (event && event.nativeEvent) {
        setStickyLayoutY(event.nativeEvent.layout.y);
      }
      onLayout && onLayout(event);
    },
    [onLayout],
  );

  const translateY = useMemo(() => {
    const y = stickyHeaderY !== -1 ? stickyHeaderY : stickyLayoutY;
    return stickyScrollY.interpolate({
      inputRange: [-1, 0, y, y + 1],
      outputRange: [0, 0, 0, 1],
    });
  }, [stickyHeaderY, stickyLayoutY, stickyScrollY]);

  return (
    <Animated.View
      onLayout={_onLayout}
      style={[style, styles.view, { transform: [{ translateY }] }]}
      {...otherProps}
    >
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  view: {
    zIndex: 100,
  },
});

export default StickyHeader;
