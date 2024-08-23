import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import useDeviceStore from "../../store/useDeviceStore";
import { Icon } from "../Icon";
import { Library } from "../Icon/library";
import SplitLine from "../SplitLine";

import OptionSheet from "./OptionSheet";
import useI18nStore from "../../store/useI18nStore";

export interface ReplyItemProps {
  title: string;
  key: string;
  icon: keyof typeof Library;
}

interface ReplyComponentProps {
  params: ReplyItemProps[];
  onSelect: (reply: ReplyItemProps) => void;
  onClose?: () => void;
}

const ReplyComponent: React.FC<ReplyComponentProps> = (props) => {
  const { params, onSelect } = props;
  const { width } = useDeviceStore();
  const { i18n } = useI18nStore();

  return (
    <>
      {params.map((param) => {
        return (
          <View key={param.key}>
            <TouchableOpacity
              onPress={() => onSelect(param)}
              style={styles.itemContainer}
            >
              <Text style={styles.itemTitle}>{i18n.t(param.title)}</Text>
              <Icon name={param.icon} color="#333" />
            </TouchableOpacity>
            <SplitLine start={0} end={width - 40} />
          </View>
        );
      })}
    </>
  );
};

const Reply = {
  show: (props: ReplyComponentProps) => {
    const { onClose, onSelect, params } = props;
    OptionSheet.show({
      onClose,
      title: "new_status_ares_title",
      needCancle: true,
      items: <ReplyComponent {...{ params, onSelect }} />,
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

export default Reply;
