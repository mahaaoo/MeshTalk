import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";

import OptionSheet from "./OptionSheet";

interface LinkTypeComponentProps {
  onSelect: () => void;
}

const LinkTypeComponent: React.FC<LinkTypeComponentProps> = (props) => {
  const { onSelect } = props;
  const { i18n } = useI18nStore();

  return (
    <>
      <TouchableOpacity onPress={onSelect} style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{i18n.t("open_link_in_app")}</Text>
        <Icon name="download" />
      </TouchableOpacity>
      <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
      <TouchableOpacity onPress={onSelect} style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{i18n.t("open_link_in_browser")}</Text>
        <Icon name="share" />
      </TouchableOpacity>
    </>
  );
};

const LinkType = {
  show: (params: LinkTypeComponentProps) => {
    OptionSheet.show({
      title: "sheet_link_type_title",
      needCancle: true,
      items: <LinkTypeComponent {...params} />,
    });
  },
  hide: OptionSheet.hide,
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
  },
});

export default LinkType;
