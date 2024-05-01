import { Image } from "expo-image";
import React, { useRef, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

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
      style={styles.imageContainer}
      activeOpacity={1}
      onPress={() => handleClick && handleClick(index)}
    >
      <Image
        key={item.id}
        style={styles.imageContainer}
        source={{
          uri: item.url,
        }}
        resizeMode="cover"
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

  const overlayRef: any = useRef(null);

  const handleClick = useCallback((index: number) => {
    // const overlayView = (
    //   <Overlay.PopView
    //     containerStyle={{flex: 1}}
    //     overlayOpacity={1}
    //     type="custom"
    //     customBounds={{x: 0, y: 0, width: Screen.width, height: Screen.height}}
    //     ref={overlayRef}>
    //     <AlbumView
    //       style={{flex: 1}}
    //       control={true}
    //       images={imageList.map(item => {
    //         return {uri: item?.url};
    //       })}
    //       defaultIndex={index}
    //       onPress={() => overlayRef && overlayRef?.current?.close()}
    //     />
    //     <StatusBar animated={false} hidden={true} />
    //   </Overlay.PopView>
    // );
    // Overlay.show(overlayView);
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
