import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Image } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDREPLY } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import { Icon } from "../Icon";
import { Library } from "../Icon/library";
import SplitLine from "../SplitLine";

export interface ReplyItemProps {
  title: string;
  key: string;
  icon: keyof typeof Library;
}

interface ActionsSheetTyps {
  params: ReplyItemProps[];
  onSelect: (reply: ReplyItemProps) => void;
  onClose: () => void;
}

const ReplyComponent: React.FC<ActionsSheetTyps> = (props) => {
  const { params, onSelect } = props;
  const { i18n } = useI18nStore();
  return (
    <View
      style={[
        styles.scrollViewContainer,
        { paddingBottom: useDeviceStore.getState().insets.bottom },
      ]}
    >
      <View style={styles.titleContainer} />
      <Text style={styles.title}>{i18n.t("new_status_ares_title")}</Text>
      <View style={[styles.item, { marginTop: 10 }]}>
        {params.map((param) => {
          return (
            <View key={param.key}>
              <TouchableOpacity
                onPress={() => onSelect(param)}
                style={styles.itemContainer}
              >
                <Text style={styles.itemTitle}>{param.title}</Text>
                <Icon name={param.icon} color="#333" />
              </TouchableOpacity>
              <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => {
          Reply.hide();
        }}
        style={[styles.item, styles.cacelButton]}
      >
        <Text style={styles.itemTitle}>{i18n.t("new_status_ares_cancel")}</Text>
      </TouchableOpacity>
    </View>
  );
};

// TODO: 在replyObj中获取
const Reply = {
  key: ACTIONMODALIDREPLY,
  template: ({ onSelect, onClose, params }: ActionsSheetTyps) => {
    return (
      <TranslateContainer onDisappear={onClose} gesture>
        <ReplyComponent {...{ onSelect, onClose, params }} />
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
