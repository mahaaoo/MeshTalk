/**
 * 根据ScrollView或者FlatList等组件，下拉动作放大头部的图片效果
 */

import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withTiming,
} from "react-native-reanimated";

import Colors from "../../config/colors";
import useDeviceStore from "../../store/useDeviceStore";
import { ImagePreviewUtil } from "../ImagePreview";

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
  const { width } = useDeviceStore();

  const onImageLoad = useCallback(() => {
    setShow(true);
    imageOpcity.value = withTiming(1, { duration: 1000 });
  }, []);

  const imageStyle = useAnimatedStyle<{ transform: any }>(() => {
    return {
      opacity: imageOpcity.value,
      transform: [
        {
          translateY: interpolate(
            -scrollY.value,
            [-imageHeight, 0],
            [-imageHeight / 2, 0],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            -scrollY.value,
            [-imageHeight, 0, imageHeight],
            [2, 1, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const handleImage = () => {
    ImagePreviewUtil.show(url, 0);
  };

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
          style={[
            {
              height: imageHeight,
              width,
            },
            imageStyle,
          ]}
          source={{
            uri: url,
          }}
        />
      </Animated.View>
      <TouchableOpacity onPress={handleImage} style={{ height: imageHeight }} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    width: useDeviceStore.getState().width,
  },
});

export default StretchableImage;
