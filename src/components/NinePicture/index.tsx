import { Image } from "expo-image";
import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { ImagePreviewUtil } from "../ImagePreview";
import SpacingBox from "../SpacingBox";
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
        contentFit="cover"
        onError={() => {
          console.log("图片加载失败");
        }}
      />
    </TouchableOpacity>
  );
};

interface NinePictureProps {
  imageList: any[];
  height?: number;
}

const NinePicture: React.FC<NinePictureProps> = (props) => {
  const { imageList = [], height = 220 } = props;
  // console.log(imageList);

  const handleClick = useCallback((index: number) => {
    // console.log("handleClick", index);
    ImagePreviewUtil.show(
      imageList.map((image) => image.url),
      index,
    );
  }, []);

  if (imageList.length === 0) {
    return null;
  }

  if (imageList.length === 1) {
    return (
      <>
        <View
          style={[
            styles.singleImage,
            {
              height,
            },
          ]}
        >
          <MediaImage item={imageList[0]} index={0} handleClick={handleClick} />
        </View>
        <SpacingBox height={15} />
      </>
    );
  }

  if (imageList.length === 2) {
    return (
      <>
        <View
          style={[
            styles.singleImage,
            {
              height,
            },
          ]}
        >
          <MediaImage item={imageList[0]} index={0} handleClick={handleClick} />
          <SpacingBox width={5} />
          <MediaImage item={imageList[1]} index={1} handleClick={handleClick} />
        </View>
        <SpacingBox height={15} />
      </>
    );
  }

  if (imageList.length === 3) {
    return (
      <>
        <View
          style={[
            styles.singleImage,
            {
              height,
            },
          ]}
        >
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
        </View>
        <SpacingBox height={15} />
      </>
    );
  }

  if (imageList.length === 4) {
    return (
      <>
        <View
          style={[
            styles.singleImage,
            {
              height,
            },
          ]}
        >
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
        </View>
        <SpacingBox height={15} />
      </>
    );
  }

  return null;
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
