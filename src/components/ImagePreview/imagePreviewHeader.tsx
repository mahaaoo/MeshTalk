import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { ModalUtil } from "react-native-ma-modal";
import {
  useAnimatedReaction,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";

import { Icon } from "../Icon";

interface ImagePreviewHeaderProps {
  currentIndex: SharedValue<number>;
  total: number;
}

const ImagePreviewHeader: React.FC<ImagePreviewHeaderProps> = (props) => {
  const { currentIndex, total } = props;

  const [index, setIndex] = useState(currentIndex.value);

  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      runOnJS(setIndex)(value + 1);
    },
  );

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 88,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 55,
        paddingHorizontal: 20,
      }}
    >
      <View>
        <Text style={{ color: "white", fontSize: 15 }}>
          {index + "/" + total}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => ModalUtil.remove("global-image-preview")}
      >
        <Icon name="close" color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ImagePreviewHeader;
