import { BlurView } from "expo-blur";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ModalUtil, UniqueModal } from "react-native-ma-modal";
import { MeasuredDimensions } from "react-native-reanimated";

import { PopOptionsContainer } from "./PopOptionsContainer";
import { POPMODALID } from "../../config/constant";
import { Icon } from "../Icon";
import SpacingBox from "../SpacingBox";
import SplitLine from "../SplitLine";

interface PopOptionsProps {
  acct: string;
}

const PopOptions: React.FC<PopOptionsProps> = (props) => {
  const { acct } = props;
  const showAcct = ` @${acct}`;

  return (
    <View style={styles.container}>
      <BlurView intensity={98} tint="light">
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>关注{showAcct}</Text>
          <Icon name="follow" color="#333" />
        </TouchableOpacity>
        <SpacingBox height={5} color="#e9e9e9" />
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>提及{showAcct}</Text>
          <Icon name="aite" color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>屏蔽{showAcct}</Text>
          <Icon name="mute" size={22} color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>拉黑{showAcct}</Text>
          <Icon name="block" size={20} color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>举报{showAcct}</Text>
          <Icon name="report" size={20} color="#333" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

export const PopOptonsUtil: UniqueModal = {
  key: POPMODALID,
  template: (measurement: MeasuredDimensions, acct: string) => {
    return (
      <PopOptionsContainer
        duration={200}
        mask={false}
        measurement={measurement}
      >
        <PopOptions acct={acct} />
      </PopOptionsContainer>
    );
  },
  show: (measurement: MeasuredDimensions, acct: string) => {
    ModalUtil.add(PopOptonsUtil.template(measurement, acct), PopOptonsUtil.key);
  },
  hide: () => ModalUtil.remove(PopOptonsUtil.key || ""),
  isExist: () => ModalUtil.isExist(PopOptonsUtil.key || "") || false,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 230,
    overflow: "hidden",
  },
  item: {
    paddingVertical: 15,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
