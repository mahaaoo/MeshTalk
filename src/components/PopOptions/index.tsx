import { acctName } from "@utils/string";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ModalUtil, UniqueModal } from "react-native-ma-modal";
import { MeasuredDimensions } from "react-native-reanimated";

import { PopOptionsContainer } from "./PopOptionsContainer";
import { POPMODALID } from "../../config/constant";
import { Relationship } from "../../config/interface";
import { getRelationships } from "../../server/account";
import { Icon } from "../Icon";
import SpacingBox from "../SpacingBox";
import SplitLine from "../SplitLine";

interface PopOptionsProps {
  acct: string;
  id: string;
}

const PopOptions: React.FC<PopOptionsProps> = (props) => {
  const { id } = props;
  const [relation, setRelation] = useState<Relationship>();

  useEffect(() => {
    const fetchRelation = async () => {
      const { data, ok } = await getRelationships(id);
      if (ok && data) {
        setRelation(data[0]);
      }
    };

    fetchRelation();
  }, [id]);

  return (
    <View style={styles.container}>
      <BlurView intensity={98} tint="light">
        <TouchableOpacity style={styles.item}>
          {!relation ? (
            <ActivityIndicator />
          ) : relation?.following ? (
            <>
              <Text style={styles.text}>取消关注该用户</Text>
              <Icon name="unfollow" color="#333" />
            </>
          ) : (
            <>
              <Text style={styles.text}>关注该用户</Text>
              <Icon name="follow" color="#333" />
            </>
          )}
        </TouchableOpacity>
        <SpacingBox height={5} color="#e9e9e9" />
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>提及</Text>
          <Icon name="aite" color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>屏蔽(mute)</Text>
          <Icon name="mute" size={22} color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item}>
          <Text style={[styles.text, { color: "red" }]}>拉黑(block)</Text>
          <Icon name="block" size={20} color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item}>
          <Text style={[styles.text, { color: "red" }]}>举报</Text>
          <Icon name="report" size={20} color="#333" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

export const PopOptonsUtil: UniqueModal = {
  key: POPMODALID,
  template: (measurement: MeasuredDimensions, acct: string, id: string) => {
    return (
      <PopOptionsContainer
        duration={200}
        mask={false}
        measurement={measurement}
      >
        <PopOptions id={id} acct={acct} />
      </PopOptionsContainer>
    );
  },
  show: (measurement: MeasuredDimensions, acct: string, id: string) => {
    ModalUtil.add(
      PopOptonsUtil.template(measurement, acct, id),
      PopOptonsUtil.key,
    );
  },
  hide: () => ModalUtil.remove(PopOptonsUtil.key || ""),
  isExist: () => ModalUtil.isExist(PopOptonsUtil.key || "") || false,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 220,
    overflow: "hidden",
  },
  item: {
    paddingVertical: 15,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
  },
});
