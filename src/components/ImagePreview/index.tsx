import React from "react";
import { StyleSheet } from "react-native";
import {
  OpacityContainer,
  ModalUtil,
  UniqueModal,
} from "react-native-ma-modal";

import ImagePreview from "./imagePreView";
import { IMAGEMODALID } from "../../config/constant";

export const ImagePreviewUtil: UniqueModal = {
  key: IMAGEMODALID,
  template: (imageList: string[], initialIndex: number) => {
    return (
      <OpacityContainer mask={false} modal containerStyle={styles.container}>
        <ImagePreview {...{ imageList, initialIndex }} />
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

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
