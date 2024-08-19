import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { OPTIONSSHEET } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";

interface OptionSheetProps {
  onClose?: () => void;
  title?: string;
  items: React.ReactNode;
  needCancle?: boolean;
}

const OptionSheetComponent: React.FC<OptionSheetProps> = (props) => {
  const { title = "", items, needCancle = false } = props;
  const { i18n } = useI18nStore();
  return (
    <View
      style={[
        styles.scrollViewContainer,
        { paddingBottom: useDeviceStore.getState().insets.bottom },
      ]}
    >
      <View style={styles.titleContainer} />
      {title.length > 0 ? (
        <Text style={styles.title}>{i18n.t(title)}</Text>
      ) : null}
      <View style={[styles.item, { marginTop: 10 }]}>{items}</View>
      {needCancle ? (
        <TouchableOpacity
          onPress={() => {
            OptionSheet.hide();
          }}
          style={[styles.item, styles.cacelButton]}
        >
          <Text style={styles.itemTitle}>
            {i18n.t("new_status_ares_cancel")}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

// TODO: 在replyObj中获取
const OptionSheet = {
  key: OPTIONSSHEET,
  template: ({ onClose, ...props }: OptionSheetProps) => {
    return (
      <TranslateContainer onDisappear={onClose} gesture>
        <OptionSheetComponent {...{ onClose, ...props }} />
      </TranslateContainer>
    );
  },
  show: (params: OptionSheetProps) => {
    ModalUtil.add(OptionSheet.template(params), OptionSheet.key);
  },
  hide: () => ModalUtil.remove(OptionSheet.key || ""),
  isExist: () => ModalUtil.isExist(OptionSheet.key || ""),
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

export default OptionSheet;
