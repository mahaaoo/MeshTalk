import React from "react";
import { View, Text } from "react-native";
import {
  ModalUtil,
  OpacityContainer,
  UniqueModal,
} from "react-native-ma-modal";

interface PopOptionsProps {}

const PopOptions: React.FC<PopOptionsProps> = (props) => {
  const {} = props;

  return (
    <View style={{ width: 250, height: 4 * 50 }}>
      <View style={{ height: 50, width: "100%" }}>
        <Text>屏蔽</Text>
      </View>
      <View style={{ height: 50, width: "100%" }}>
        <Text>提及</Text>
      </View>
      <View style={{ height: 50, width: "100%" }}>
        <Text>拉黑</Text>
      </View>
      <View style={{ height: 50, width: "100%" }}>
        <Text>举报</Text>
      </View>
    </View>
  );
};

export const ImagePreviewUtil: UniqueModal = {
  key: "global-image-preview",
  template: (imageList: string[], initialIndex: number) => {
    return (
      <OpacityContainer
        mask={false}
        modal
        containerStyle={{ justifyContent: "center", alignItems: "center" }}
      >
        <PopOptions />
      </OpacityContainer>
    );
  },
  show: (imageList: string[], initialIndex: number) => {
    ModalUtil.add(
      ImagePreviewUtil.template(imageList, initialIndex),
      ImagePreviewUtil.key,
    );
  },
  hide: () => ModalUtil.remove(ImagePreviewUtil.key || ""),
  isExist: () => ModalUtil.isExist(ImagePreviewUtil.key || "") || false,
};

export default PopOptions;
