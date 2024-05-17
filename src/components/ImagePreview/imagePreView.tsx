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

import useDeviceStore from "../../store/useDeviceStore";
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

interface ImagePreviewProps {
  imageList: string[];
  initialIndex?: number;
}

const SCALE_MAX = 2;
const SCALE_MIN = 0.5;

const duration = 400;

const ImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { imageList, initialIndex = 0 } = props;
  const { width, height } = useDeviceStore();
  const currentIndex = useSharedValue(initialIndex);

  // 水平平移
  const snapPointsX = imageList.map((_, index) => -width * index);
  const translateX = useSharedValue(-width * initialIndex);
  const offsetX = useSharedValue(0);

  const snapPointsY = [-0.25 * height, 0, 0.25 * height];
  const translateY = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const opacity = useSharedValue(1);

  const childrenX = useSharedValue(0);

  const imageY = useSharedValue(0);
  const offsetImageY = useSharedValue(0);
  const imageX = useSharedValue(0);
  const offsetImageX = useSharedValue(0);

  const scale = useSharedValue(1);
  const offsetScale = useSharedValue(0);

  const panGestureY = Gesture.Pan()
    .onBegin(() => {
      offsetImageY.value = imageY.value;
      offsetImageX.value = imageX.value;

      offsetY.value = translateY.value;
    })
    .onUpdate(({ translationY, translationX }) => {
      if (scale.value > 1) {
        imageX.value = translationX + offsetImageX.value;
        imageY.value = translationY + offsetImageY.value;
      } else {
        childrenX.value = translationX;
        translateY.value = translationY + offsetY.value;
        opacity.value = interpolate(
          translateY.value,
          [-0.3 * height, 0, 0.3 * height],
          [0.7, 1, 0.7],
          Extrapolation.CLAMP,
        );
        scale.value = interpolate(
          translateY.value,
          [-height, 0, height],
          [0.5, 1, 0.5],
          Extrapolation.CLAMP,
        );
      }
    })
    .onEnd(({ velocityY }) => {
      if (scale.value > 1) {
      } else {
        const destY = snapPoint(translateY.value, velocityY, snapPointsY);

        if (Math.abs(destY) >= 0.25 * height) {
          // TODO：可以关闭
        }
        translateY.value = withTiming(0, { duration });
        childrenX.value = withTiming(0, { duration });
        opacity.value = withTiming(1, { duration });
        scale.value = withTiming(1, { duration });
      }
    });

  const panGestureX = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onBegin(() => {
      offsetX.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      if (translateY.value !== 0 || scale.value !== 1) return;
      translateX.value = clamp(
        translationX + offsetX.value,
        -(imageList.length - 1) * width,
        0,
      );
    })
    .onEnd(({ velocityX }) => {
      if (translateY.value !== 0 || scale.value !== 1) return;
      const destX = snapPoint(translateX.value, velocityX, snapPointsX);
      const nextIndex = Math.abs(destX / width);

      currentIndex.value = clamp(
        nextIndex,
        currentIndex.value - 1,
        currentIndex.value + 1,
      );
      translateX.value = withTiming(-currentIndex.value * width, {
        duration,
      });
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      offsetScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = clamp(offsetScale.value * e.scale, 0.5, 2);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1, { duration });
        imageX.value = 0;
        imageY.value = 0;
      }
    });

  const doubleClick = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      imageX.value = 0;
      imageY.value = 0;
      if (scale.value === 1) {
        scale.value = withTiming(2, { duration });
      } else {
        scale.value = withTiming(1, { duration });
      }
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
      <GestureDetector
        gesture={Gesture.Exclusive(
          Gesture.Race(panGestureY, panGestureX, pinchGesture),
          doubleClick,
        )}
      >
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
            <ImageContainer
              key={index}
              url={a}
              {...{
                translateY,
                childrenX,
                index,
                currentIndex,
                scale,
                imageY,
                imageX,
              }}
            />
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
  const {
    url,
    translateY,
    childrenX,
    index,
    currentIndex,
    scale,
    imageY,
    imageX,
  } = props;
  const { width } = useDeviceStore();

  const animationStyle = useAnimatedStyle<{ transform: any }>(() => {
    if (scale.value > 1) {
      return {
        transform: [
          {
            scale: currentIndex.value === index ? scale.value : 1,
          },
          {
            translateY: currentIndex.value === index ? imageY.value : 0,
          },
          {
            translateX: currentIndex.value === index ? imageX.value : 0,
          },
        ],
      };
    }

    return {
      transform: [
        {
          scale: currentIndex.value === index ? scale.value : 1,
        },
        {
          translateY: currentIndex.value === index ? translateY.value : 0,
        },
        {
          translateX: currentIndex.value === index ? childrenX.value : 0,
        },
      ],
    };
  });

  return (
    <Animated.View style={[animationStyle]}>
      <Image
        source={url}
        style={{ flex: 1, width, height: undefined }}
        contentFit="contain"
      />
    </Animated.View>
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
