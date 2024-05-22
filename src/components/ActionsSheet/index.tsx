import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALID } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";

type ActionsSheetTyps = {
  onSelect: (reply: string) => void;
  onClose: () => void;
  bottom: number;
};

const ActionsSheet = {
  key: ACTIONMODALID,
  template: ({ onSelect, onClose, bottom }: ActionsSheetTyps) => (
    <TranslateContainer onDisappear={onClose} gesture>
      <View style={[styles.scrollViewContainer, { paddingBottom: bottom }]}>
        <View style={styles.titleContainer} />
        <Text style={styles.title}>谁可以回复？</Text>
        <Text style={styles.decContainer}>
          选择谁可以回复这条嘟文，任何提及的人始终都能回复。
        </Text>
        <TouchableOpacity
          style={styles.actionitem}
          onPress={() => onSelect("任何人可以回复")}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../../images/earth_white.png")}
              style={styles.iconEarthWhite}
            />
          </View>
          <Text style={styles.actionReplyText}>任何人可以回复</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionitem}
          onPress={() => onSelect("关注的人可以回复")}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../../images/on_white.png")}
              style={styles.iconOnWhite}
            />
          </View>
          <Text style={styles.actionReplyText}>关注的人可以回复</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionitem}
          onPress={() => onSelect("提及的人才可以回复")}
        >
          <View style={styles.imageContainer}>
            <Image
              source={require("../../images/mention_white.png")}
              style={styles.iconMentionWhite}
            />
          </View>
          <Text style={styles.actionReplyText}>提及的人才可以回复</Text>
        </TouchableOpacity>
      </View>
    </TranslateContainer>
  ),
  show: (params: ActionsSheetTyps) => {
    ModalUtil.add(ActionsSheet.template(params), ActionsSheet.key);
  },
  hide: () => ModalUtil.remove(ActionsSheet.key || ""),
  isExist: () => ModalUtil.isExist(ActionsSheet.key || ""),
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
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
    marginTop: 10,
  },
  decContainer: {
    fontSize: 14,
    color: Colors.grayTextColor,
    textAlign: "center",
    marginVertical: 10,
  },
  actionitem: {
    width: useDeviceStore.getState().width,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.theme,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  iconEarthWhite: {
    width: 25,
    height: 25,
  },
  actionReplyText: {
    fontSize: 18,
  },
  iconOnWhite: {
    width: 25,
    height: 25,
  },
  iconMentionWhite: {
    width: 25,
    height: 25,
  },
});

export default ActionsSheet;
