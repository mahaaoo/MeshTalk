import { Image } from "expo-image";
import { ImagePickerAsset } from "expo-image-picker";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

import { Icon } from "../../components/Icon";

interface MediaDisplayProps {
  media: ImagePickerAsset;
  deleMedia: () => void;
}

const MediaDisplay: React.FC<MediaDisplayProps> = (props) => {
  const { media, deleMedia } = props;
  const resizeWidth = (media.width / media.height) * 200;

  return (
    <Animated.View
      entering={ZoomIn}
      exiting={ZoomOut}
      style={{
        height: 200,
        width: resizeWidth,
        marginHorizontal: 5,
      }}
    >
      <Image
        source={{ uri: media.uri }}
        style={styles.image}
        contentFit="contain"
        transition={500}
      />
      <TouchableOpacity onPress={deleMedia} style={styles.close}>
        <Icon name="close" size={15} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  close: {
    opacity: 0.8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 5,
    right: 5,
  },
});

export default MediaDisplay;
