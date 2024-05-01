/**
 * 根据ScrollView或者FlatList等组件，下拉动作放大头部的图片效果
 */

import React, { useState, useRef, useCallback, useMemo } from "react";
import { Animated, View, StyleSheet } from "react-native";

import Colors from "../../config/colors";
import Screen from "../../config/screen";

interface StretchableImageProps {
  imageHeight: number;
  scrollY: any;
  url: string;
  isblur?: boolean;
  blurRadius?: number;
}

const StretchableImage: React.FC<StretchableImageProps> = (props) => {
  const { imageHeight, scrollY, url, isblur = false, blurRadius = 10 } = props;

  const [isShow, setShow] = useState(false);
  const imageAnimated: any = useRef(new Animated.Value(0)).current;

  const onImageLoad = useCallback(() => {
    setShow(true);

    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const radius = useMemo(() => {
    if (!isblur) {
      return 0;
    }
    return blurRadius;
  }, [isblur, blurRadius]);

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
              opacity: imageAnimated,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [-imageHeight, 0],
                    outputRange: [-imageHeight / 2, 0],
                    extrapolate: "clamp",
                  }),
                },
                {
                  scale: scrollY.interpolate({
                    inputRange: [-imageHeight, 0, imageHeight],
                    outputRange: [2, 1, 1],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
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
