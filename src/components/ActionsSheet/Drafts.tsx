import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDDRAFTS } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import SplitLine from "../SplitLine";
import usePublishStore, { NewStatusParams } from "../../store/usePublishStore";

interface ActionsSheetTyps {
  onSelect: (draft: NewStatusParams) => void;
  onClose: () => void;
}

const DraftsComponent: React.FC<ActionsSheetTyps> = (props) => {
  const { onSelect } = props;
  const { i18n } = useI18nStore();
  const { drafts } = usePublishStore();
  const { width } = useDeviceStore();

  return (
    <View
      style={[
        styles.scrollViewContainer,
        { paddingBottom: useDeviceStore.getState().insets.bottom },
      ]}
    >
      <View style={styles.titleContainer} />
      <Text style={styles.title}>{i18n.t("new_status_draft_text")}</Text>
      <View style={[styles.item, { marginTop: 10, flex: 1 }]}>
        {drafts.map((draft) => {
          return (
            <View key={draft.timestamp}>
              <TouchableOpacity
                onPress={() => onSelect(draft)}
                style={styles.sigleDraft}
              >
                <Text>{draft.status}</Text>
              </TouchableOpacity>
              <SplitLine start={0} end={width - 40} />
            </View>
          );
        })}
      </View>
      <TouchableOpacity
        onPress={() => {
          Drafts.hide();
        }}
        style={[styles.item, styles.cacelButton]}
      >
        <Text style={styles.itemTitle}>{i18n.t("new_status_ares_cancel")}</Text>
      </TouchableOpacity>
    </View>
  );
};

// TODO: 在replyObj中获取
const Drafts = {
  key: ACTIONMODALIDDRAFTS,
  template: ({ onSelect, onClose }: ActionsSheetTyps) => {
    return (
      <TranslateContainer onDisappear={onClose} gesture>
        <DraftsComponent {...{ onSelect, onClose }} />
      </TranslateContainer>
    );
  },
  show: (params: ActionsSheetTyps) => {
    ModalUtil.add(Drafts.template(params), Drafts.key);
  },
  hide: () => ModalUtil.remove(Drafts.key || ""),
  isExist: () => ModalUtil.isExist(Drafts.key || ""),
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
    height: useDeviceStore.getState().height * 0.8,
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
  sigleDraft: {
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
});

export default Drafts;
