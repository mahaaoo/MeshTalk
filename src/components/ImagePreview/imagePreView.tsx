import { Image } from "expo-image";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ModalUtil } from "react-native-ma-modal";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  clamp,
  useAnimatedReaction,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

import { Screen } from "../../config";
import { Icon } from "../Icon";

const snapPoint = (
  value: number,
  velocity: number,
  points: readonly number[],
): number => {
  "worklet";
  const point = value + 0.2 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter((p) => Math.abs(point - p) === minDelta)[0];
};

const { height, width } = Screen;
interface ImagePreviewProps {
  imageList: string[];
  initialIndex?: number;
}

const ImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { imageList, initialIndex = 0 } = props;

  const currentIndex = useSharedValue(initialIndex);

  // 水平平移
  const snapPointsX = imageList.map((_, index) => -width * index);
  const translateX = useSharedValue(-width * initialIndex);
  const offsetX = useSharedValue(0);

  const snapPointsY = [-0.25 * height, 0, 0.25 * height];
  const translateY = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const opacity = useSharedValue(1);

  const panGestureY = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .onBegin(() => {
      offsetY.value = translateY.value;
    })
    .onUpdate(({ translationY }) => {
      translateY.value = translationY + offsetY.value;
      opacity.value = interpolate(
        translateY.value,
        [-0.3 * height, 0, 0.3 * height],
        [0.7, 1, 0.7],
        Extrapolation.CLAMP,
      );
    })
    .onEnd(({ velocityY }) => {
      const destY = snapPoint(translateY.value, velocityY, snapPointsY);

      if (Math.abs(destY) >= 0.25 * height) {
        // TODO：可以关闭
      }
      translateY.value = withTiming(0, { duration: 500 });
      opacity.value = withTiming(1, { duration: 500 });
    });

  const panGestureX = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      offsetX.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      // console.log(translationX + offsetX.value);
      translateX.value = clamp(
        translationX + offsetX.value,
        -(imageList.length - 1) * width,
        0,
      );
    })
    .onEnd(({ velocityX }) => {
      const destX = snapPoint(translateX.value, velocityX, snapPointsX);
      const nextIndex = Math.abs(destX / width);

      currentIndex.value = clamp(
        nextIndex,
        currentIndex.value - 1,
        currentIndex.value + 1,
      );
      translateX.value = withTiming(-currentIndex.value * width, {
        duration: 500,
      });
    });

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "black" },
          opacityStyle,
        ]}
      />
      <GestureDetector gesture={Gesture.Race(panGestureX, panGestureY)}>
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              flexDirection: "row",
              width: width * imageList.length,
              height,
            },
            animationStyle,
          ]}
        >
          {imageList.map((a, index) => (
            <ImageContainer key={index} url={a} {...{ translateY }} />
          ))}
        </Animated.View>
      </GestureDetector>
      <ImagePreviewHeader
        currentIndex={currentIndex}
        total={imageList.length}
      />
    </View>
  );
};

const ImageContainer = (props) => {
  const { url, translateY } = props;

  const scale = useSharedValue(1);
  const offset = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = offset.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1, { duration: 500 });
        offset.value = 1;
      } else {
        offset.value = scale.value;
      }
    });

  useAnimatedReaction(
    () => translateY.value,
    (value) => {
      scale.value = interpolate(
        value,
        [-height, 0, height],
        [0.5, 1, 0.5],
        Extrapolation.CLAMP,
      );
    },
  );

  const animationStyle = useAnimatedStyle<{ transform }>(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View style={[animationStyle]}>
        <Image
          source={url}
          style={{ flex: 1, width, height: undefined }}
          contentFit="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
};

const ImagePreviewHeader = (props) => {
  const { currentIndex, total } = props;

  const [index, setIndex] = useState(currentIndex.value);

  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      runOnJS(setIndex)(value + 1);
    },
  );

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 88,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 55,
        paddingHorizontal: 20,
      }}
    >
      <View>
        <Text style={{ color: "white", fontSize: 15 }}>
          {index + "/" + total}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => ModalUtil.remove("global-image-preview")}
      >
        <Icon name="close" color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ImagePreview;
