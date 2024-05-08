/**
 * 根据ScrollView或者FlatList等组件，下拉动作放大头部的图片效果
 */

import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withTiming,
} from "react-native-reanimated";

import Colors from "../../config/colors";
import Screen from "../../config/screen";

interface StretchableImageProps {
  imageHeight: number;
  scrollY: SharedValue<number>;
  url: string;
  isblur?: boolean;
  blurRadius?: number;
}

const StretchableImage: React.FC<StretchableImageProps> = (props) => {
  const { imageHeight, scrollY, url, isblur = false, blurRadius = 10 } = props;

  const [isShow, setShow] = useState(false);
  const imageOpcity = useSharedValue(0);

  const onImageLoad = useCallback(() => {
    setShow(true);
    imageOpcity.value = withTiming(1, { duration: 1000 });
  }, []);

  const radius = useMemo(() => {
    if (!isblur) {
      return 0;
    }
    return blurRadius;
  }, [isblur, blurRadius]);

  const imageStyle = useAnimatedStyle(() => {
    return {
      opacity: imageOpcity.value,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-imageHeight, 0],
            [-imageHeight / 2, 0],
            Extrapolation.CLAMP,
          ),
        },
        // {
        //   scale: interpolate(
        //     scrollY.value,
        //     [-imageHeight, 0, imageHeight],
        //     [2, 1, 1],
        //     Extrapolation.CLAMP,
        //   ),
        // },
      ],
    };
  });

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            height: imageHeight,
            backgroundColor: isShow ? Colors.defaultWhite : Colors.theme,
          },
        ]}
      >
        <Animated.Image
          onLoad={onImageLoad}
          blurRadius={radius}
          style={[
            {
              height: imageHeight,
              width: Screen.width,
            },
            imageStyle,
          ]}
          source={{
            uri: url,
          }}
        />
      </Animated.View>
      <View style={{ height: imageHeight }} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: Screen.width,
  },
});

export default StretchableImage;
