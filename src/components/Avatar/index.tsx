import { Image } from "expo-image";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import Screen from "../../config/screen";
import { Icon } from "../Icon";

interface AvatarProps {
  url: string | undefined;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const [isLoad, setIsLoad] = useState(true);
  const { url, size = 45, borderColor, borderWidth } = props;

  // 为请求失败的头像，添加一个默认的头像图标
  if (!isLoad || !url || url.length === 0) {
    return (
      <View
        style={[
          styles.border,
          {
            width: size,
            height: size,
            borderColor,
            borderWidth,
          },
        ]}
      >
        <Icon name="defaultAvatar" size={25} color="#ddd" />
      </View>
    );
  }

  return (
    <Image
      style={[
        styles.border,
        {
          width: size,
          height: size,
          borderColor,
          borderWidth,
        },
      ]}
      source={{
        uri: url,
      }}
      onError={() => {
        console.log("头像加载失败");
        setIsLoad(false);
      }}
      contentFit="contain"
    />
  );
};

const styles = StyleSheet.create({
  defaultView: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderColor: "#9f9f9f",
    borderWidth: Screen.onePixel,
    justifyContent: "center",
    alignItems: "center",
  },
  border: {
    borderRadius: 8,
  },
});

export default Avatar;
