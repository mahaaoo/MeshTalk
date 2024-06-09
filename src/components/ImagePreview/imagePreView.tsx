import { snapPoint } from "@utils/math";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ModalUtil, useModalAnimated } from "react-native-ma-modal";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  clamp,
  runOnJS,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
} from "react-native-reanimated";

import ImageContainer from "./imageContainer";
import ImagePreviewHeader from "./imagePreviewHeader";
import useDeviceStore from "../../store/useDeviceStore";

interface ImagePreviewProps {
  imageList: string[];
  initialIndex?: number;
}

const SCALE_MAX = 2;
const SCALE_MIN = 0.5;

const duration = 400;

const ImagePreview: React.FC<ImagePreviewProps> = (props) => {
  const { imageList, initialIndex = 0 } = props;
  const { progress } = useModalAnimated();
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

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      // TODO:需要progress的值，做一个scale动画，但ma-modal有些问题需更新
      // if (!didMount.value) {
      //   return;
      // }
      // console.log("123", value);
      // opacity.value = interpolate(value, [0, 0.8], [0, 1], Extrapolation.CLAMP);
      // scale.value = interpolate(value, [0, 0.8], [0.5, 1], Extrapolation.CLAMP);
    },
  );

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
          [0.9, 1, 0.9],
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
          opacity.value = withTiming(0, { duration: 250 });
          translateY.value = withTiming(
            destY > 0 ? height : -height,
            { duration: 250 },
            () => {
              runOnJS(ModalUtil.remove)("global-image-preview");
            },
          );
          return;
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
          {imageList.map((image, index) => (
            <ImageContainer
              key={index}
              url={image}
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
        scale={scale}
        opacity={opacity}
        url={imageList[currentIndex.value]}
      />
    </View>
  );
};

export default ImagePreview;
