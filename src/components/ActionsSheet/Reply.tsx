import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDREPLY } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";

type ActionsSheetTyps = {
  onSelect: (reply: string) => void;
  onClose: () => void;
};

// TODO: 在replyObj中获取
const Reply = {
  key: ACTIONMODALIDREPLY,
  template: ({ onSelect, onClose }: ActionsSheetTyps) => {
    return (
      <TranslateContainer onDisappear={onClose} gesture>
        <View
          style={[
            styles.scrollViewContainer,
            { paddingBottom: useDeviceStore.getState().insets.bottom },
          ]}
        >
          <View style={styles.titleContainer} />
          <Text style={styles.title}>谁可以回复？</Text>
          <View style={[styles.item, { marginTop: 10 }]}>
            <TouchableOpacity
              onPress={() => onSelect("公开")}
              style={styles.itemContainer}
            >
              <Text style={styles.itemTitle}>公开</Text>
              <Icon name="unlock" color="#333" />
            </TouchableOpacity>
            <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
            <TouchableOpacity
              onPress={() => onSelect("不出现在公共时间线上")}
              style={styles.functionContainer}
            >
              <Text style={styles.itemTitle}>不出现在公共时间线上</Text>
              <Icon name="replyLock" color="#333" />
            </TouchableOpacity>
            <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
            <TouchableOpacity
              onPress={() => onSelect("仅关注者可见")}
              style={styles.functionContainer}
            >
              <Text style={styles.itemTitle}>仅关注者可见</Text>
              <Icon name="replyFollow" color="#333" />
            </TouchableOpacity>
            <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
            <TouchableOpacity
              onPress={() => onSelect("仅提及的人可见")}
              style={styles.functionContainer}
            >
              <Text style={styles.itemTitle}>仅提及的人可见</Text>
              <Icon name="replyAite" color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              Reply.hide();
            }}
            style={[styles.item, styles.cacelButton]}
          >
            <Text style={styles.itemTitle}>取消</Text>
          </TouchableOpacity>
        </View>
      </TranslateContainer>
    );
  },
  show: (params: ActionsSheetTyps) => {
    ModalUtil.add(Reply.template(params), Reply.key);
  },
  hide: () => ModalUtil.remove(Reply.key || ""),
  isExist: () => ModalUtil.isExist(Reply.key || ""),
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    width: useDeviceStore.getState().width - 40,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  functionContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
  },
  acct: {
    fontSize: 13,
    color: Colors.grayTextColor,
  },
  cacelButton: {
    marginTop: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Reply;
