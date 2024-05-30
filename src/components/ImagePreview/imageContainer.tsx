import { Image } from "expo-image";
import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import useDeviceStore from "../../store/useDeviceStore";

interface ImageContainerProps {
  url: string;
  translateY: SharedValue<number>;
  childrenX: SharedValue<number>;
  index: number;
  currentIndex: SharedValue<number>;
  scale: SharedValue<number>;
  imageY: SharedValue<number>;
  imageX: SharedValue<number>;
}

const ImageContainer: React.FC<ImageContainerProps> = (props) => {
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
        transition={500}
      />
    </Animated.View>
  );
};

export default ImageContainer;
