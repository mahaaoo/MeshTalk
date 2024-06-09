import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDREPLY } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";
import SplitLine from "../SplitLine";

type ActionsSheetTyps = {
  onSelect: (reply: string) => void;
  onClose: () => void;
};

const PicMore = {
  key: ACTIONMODALIDREPLY,
  template: ({ onSelect, onClose }: ActionsSheetTyps) => (
    <TranslateContainer onDisappear={onClose} gesture>
      <View
        style={[
          styles.scrollViewContainer,
          { paddingBottom: useDeviceStore.getState().insets.bottom },
        ]}
      >
        <View style={styles.titleContainer} />
        <View style={styles.item}>
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>保存图片</Text>
          </View>
          <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>分享内容</Text>
          </View>
        </View>
        <View style={[styles.item, styles.cacelButton]}>
          <Text style={styles.itemTitle}>取消</Text>
        </View>
      </View>
    </TranslateContainer>
  ),
  show: (params: ActionsSheetTyps) => {
    ModalUtil.add(PicMore.template(params), PicMore.key);
  },
  hide: () => ModalUtil.remove(PicMore.key || ""),
  isExist: () => ModalUtil.isExist(PicMore.key || ""),
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    width: useDeviceStore.getState().width,
  },
  titleContainer: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.defaultLineGreyColor,
    marginVertical: 10,
  },
  item: {
    width: useDeviceStore.getState().width - 40,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  itemContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  itemTitle: {
    fontSize: 16,
  },
  cacelButton: {
    marginTop: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PicMore;
