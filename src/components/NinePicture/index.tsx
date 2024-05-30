import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ImagePreviewUtil } from "../ImagePreview";
import SpacingBox from "../SpacingBox";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface MediaImageProps {
  item: any;
  handleClick: (index: number) => void;
  index: number;
}

const MediaImage: React.FC<MediaImageProps> = (props) => {
  const { item, handleClick, index } = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.imageContainer}
      onPress={() => handleClick && handleClick(index)}
    >
      <Image
        key={item.id}
        style={styles.imageContainer}
        source={{
          uri: item.url,
        }}
        placeholder={{ blurhash: item.blurhash }}
        contentFit="cover"
        transition={500}
        onError={() => {
          console.log("图片加载失败", item);
        }}
      />
    </TouchableOpacity>
  );
};

interface NinePictureProps {
  imageList: any[];
  height?: number;
  sensitive: boolean;
}

const NinePicture: React.FC<NinePictureProps> = (props) => {
  const { imageList = [], height = 220, sensitive } = props;
  const intensity = useSharedValue(sensitive ? 95 : 0);
  const [showBlur, setShowBlur] = useState(sensitive);

  const handleClick = useCallback((index: number) => {
    // console.log("handleClick", index);
    ImagePreviewUtil.show(
      imageList.map((image) => image.url),
      index,
    );
  }, []);

  const imageContent = useMemo(() => {
    if (imageList.length === 1) {
      return (
        <MediaImage item={imageList[0]} index={0} handleClick={handleClick} />
      );
    }
    if (imageList.length === 2) {
      return (
        <>
          <MediaImage item={imageList[0]} index={0} handleClick={handleClick} />
          <SpacingBox width={5} />
          <MediaImage item={imageList[1]} index={1} handleClick={handleClick} />
        </>
      );
    }

    if (imageList.length === 3) {
      return (
        <>
          <View style={styles.imageContainer}>
            <MediaImage
              item={imageList[0]}
              index={0}
              handleClick={handleClick}
            />
          </View>
          <SpacingBox width={5} />
          <View style={styles.imageContainer}>
            <MediaImage
              item={imageList[1]}
              index={1}
              handleClick={handleClick}
            />
            <SpacingBox height={5} />
            <MediaImage
              item={imageList[2]}
              index={2}
              handleClick={handleClick}
            />
          </View>
        </>
      );
    }

    if (imageList.length === 4) {
      return (
        <>
          <View style={[{ height }, styles.imageContainer]}>
            <MediaImage
              item={imageList[0]}
              index={0}
              handleClick={handleClick}
            />
            <SpacingBox height={5} />
            <MediaImage
              item={imageList[2]}
              index={2}
              handleClick={handleClick}
            />
          </View>
          <SpacingBox width={5} />
          <View style={[{ height }, styles.imageContainer]}>
            <MediaImage
              item={imageList[1]}
              index={1}
              handleClick={handleClick}
            />
            <SpacingBox height={5} />
            <MediaImage
              item={imageList[3]}
              index={3}
              handleClick={handleClick}
            />
          </View>
        </>
      );
    }
  }, [imageList]);

  const animatedProps = useAnimatedProps(() => {
    return {
      intensity: intensity.value,
    };
  });

  if (imageList.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.singleImage,
        {
          height,
        },
      ]}
    >
      {imageContent}
      {showBlur ? (
        <AnimatedBlurView
          animatedProps={animatedProps}
          tint="dark"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: "#fff" }}>可能涉及敏感内容</Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#333",
              paddingHorizontal: 20,
              paddingVertical: 10,
              position: "absolute",
              right: 15,
              bottom: 15,
              borderRadius: 20,
              opacity: 0.9,
            }}
            onPress={() => {
              intensity.value = withTiming(0, { duration: 200 }, () => {
                runOnJS(setShowBlur)(false);
              });
            }}
          >
            <Text style={{ fontSize: 18, color: "#fff" }}>显示</Text>
          </TouchableOpacity>
        </AnimatedBlurView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  singleImage: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  imageContainer: {
    flex: 1,
  },
});

export default NinePicture;
