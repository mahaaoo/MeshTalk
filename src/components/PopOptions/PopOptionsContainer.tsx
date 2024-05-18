import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import {
  AnimationContainerProps,
  useModal,
  useModalAnimated,
} from "react-native-ma-modal";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export interface PopOptionsContainerRef {
  unMount: (callback?: () => void) => void;
}

export interface PopOptionsContainerProps extends AnimationContainerProps {
  pageY: number;
  pageX: number;
}

export const PopOptionsContainer = forwardRef<
  PopOptionsContainerRef,
  PopOptionsContainerProps
>((props, ref) => {
  const { config } = useModalAnimated();

  const {
    children,
    onClickMask,
    pointerEvents = "auto",
    mask = true,
    duration = config.duration,
    onAppear,
    onDisappear,
    modal = false,
    innerKey,
    pageY,
    pageX,
  } = props;
  const { remove, isExist } = useModal();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const childrenW = useSharedValue(0);
  const childrenH = useSharedValue(0);

  const onLayout = ({
    nativeEvent: {
      layout: { height, width },
    },
  }: any) => {
    childrenW.value = width;
    childrenH.value = height;
    mount();
  };

  const mount = useCallback(() => {
    opacity.value = withTiming(mask ? config.maskOpacity : 0, { duration });
    scale.value = withTiming(1, { duration }, () => {
      onAppear && runOnJS(onAppear)();
    });
  }, [onAppear]);

  const unMount = useCallback(() => {
    opacity.value = withTiming(0, { duration });
    scale.value = withTiming(0.5, { duration }, () => {
      onDisappear && runOnJS(onDisappear)();
    });
  }, [onDisappear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: config.maskColor,
      opacity: opacity.value,
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    const TopOrBottom = pageY >= height / 2 ? 1 : -1;
    return {
      position: "absolute",
      top: pageY < height / 2 ? pageY : pageY - childrenH.value,
      right: width - pageX,
      opacity: interpolate(scale.value, [0.5, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateX: childrenW.value / 2,
        },
        {
          translateY: (TopOrBottom * childrenH.value) / 2,
        },
        {
          scale: scale.value,
        },
        {
          translateX: -childrenW.value / 2,
        },
        {
          translateY: (-TopOrBottom * childrenH.value) / 2,
        },
      ],
    };
  }, [pageX, pageY]);

  const handleClickMask = useCallback(() => {
    if (pointerEvents === "none") return;
    if (!modal && pointerEvents === "auto") {
      if (isExist(innerKey || "")) {
        remove(innerKey);
      }
    }
    onClickMask && onClickMask();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      unMount,
    }),
    [],
  );

  return (
    <View style={{ ...StyleSheet.absoluteFillObject }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ ...StyleSheet.absoluteFillObject }}
        onPress={handleClickMask}
      >
        <Animated.View
          pointerEvents={pointerEvents}
          style={[{ ...StyleSheet.absoluteFillObject }, animationStyle]}
        />
      </TouchableOpacity>
      <Animated.View
        onLayout={onLayout}
        style={[scaleStyle]}
        pointerEvents="box-none"
      >
        {children}
      </Animated.View>
    </View>
  );
});

PopOptionsContainer.displayName = "PopOptionsContainer";
