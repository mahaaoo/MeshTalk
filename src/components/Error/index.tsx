import { Image } from "expo-image";
import React from "react";
import { View, ViewStyle } from "react-native";

const Assets = {
  NoResult: require("../../images/NO_RESULT.png"),
  NoLike: require("../../images/NO_LIKE.png"),
  NoNotify: require("../../images/NO_NOTIFY.png"),
  NoData: require("../../images/NO_DATA.png"),
};
interface ErrorProps {
  type: keyof typeof Assets;
  style: ViewStyle;
}

const Error: React.FC<ErrorProps> = (props) => {
  const { type, style } = props;

  return (
    <View style={style}>
      <Image
        source={Assets[type]}
        style={[{ width: 150, height: 150 }]}
        contentFit="cover"
      />
    </View>
  );
};

export default Error;
