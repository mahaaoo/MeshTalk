import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDREPLY } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";

type ActionsSheetTyps = {
  onSave: () => void;
  onClose: () => void;
  onShare: () => void;
};

const PicMore = {
  key: ACTIONMODALIDREPLY,
  template: ({ onSave, onClose, onShare }: ActionsSheetTyps) => (
    <TranslateContainer onDisappear={onClose} gesture>
      <View
        style={[
          styles.scrollViewContainer,
          { paddingBottom: useDeviceStore.getState().insets.bottom },
        ]}
      >
        <View style={styles.titleContainer} />
        <View style={styles.item}>
          <TouchableOpacity onPress={onSave} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>保存图片</Text>
            <Icon name="download" />
          </TouchableOpacity>
          <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
          <TouchableOpacity onPress={onShare} style={styles.itemContainer}>
            <Text style={styles.itemTitle}>分享内容</Text>
            <Icon name="share" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            PicMore.hide();
          }}
          style={[styles.item, styles.cacelButton]}
        >
          <Text style={styles.itemTitle}>取消</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
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
