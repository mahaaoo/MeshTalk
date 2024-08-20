import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";

import OptionSheet from "./OptionSheet";

interface PicMoreComponentProps {
  onSave: () => void;
  onShare: () => void;
  onClose: () => void;
}

const PicMoreComponent: React.FC<PicMoreComponentProps> = (props) => {
  const { onSave, onShare } = props;
  const { i18n } = useI18nStore();

  return (
    <>
      <TouchableOpacity onPress={onSave} style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{i18n.t("pic_save_text")}</Text>
        <Icon name="download" />
      </TouchableOpacity>
      <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
      <TouchableOpacity onPress={onShare} style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{i18n.t("pic_share_text")}</Text>
        <Icon name="share" />
      </TouchableOpacity>
    </>
  );
};

const PicMore = {
  show: (params: PicMoreComponentProps) => {
    const { onClose } = params;
    OptionSheet.show({
      onClose,
      needCancle: true,
      items: <PicMoreComponent {...params} />,
    });
  },
  hide: OptionSheet.hide,
};

const styles = StyleSheet.create({
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
});

export default PicMore;
