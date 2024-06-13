import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ModalUtil, Toast, UniqueModal } from "react-native-ma-modal";
import { MeasuredDimensions } from "react-native-reanimated";

import { PopOptionsContainer } from "./PopOptionsContainer";
import { POPMODALID } from "../../config/constant";
import { Relationship } from "../../config/interface";
import {
  followById,
  getRelationships,
  mute,
  unfollowById,
  unmute,
  block,
  unblock,
} from "../../server/account";
import { deleteStatus } from "../../server/status";
import useAccountStore from "../../store/useAccountStore";
import { Icon } from "../Icon";
import SpacingBox from "../SpacingBox";
import SplitLine from "../SplitLine";

interface PopOptionsProps {
  acct: string; //
  userId: string; // 点击的嘟文所属用户id
  statusId: string; // 点击的嘟文id
}

const PopOptions: React.FC<PopOptionsProps> = (props) => {
  const { userId, acct, statusId } = props;
  const [relation, setRelation] = useState<Relationship>();
  const { currentAccount } = useAccountStore();
  const isSelf = useMemo(() => {
    // 该条嘟文所属的用户，是否和登录用户一致，即只能删除本人发出的嘟文
    return currentAccount?.acct === acct;
  }, [acct, currentAccount]);

  useEffect(() => {
    const fetchRelation = async () => {
      const { data, ok } = await getRelationships(userId);
      if (ok && data) {
        setRelation(data[0]);
      }
    };

    !isSelf && fetchRelation();
  }, [userId]);

  const unfollow = async () => {
    setRelation(undefined);
    const { data, ok } = await unfollowById(userId);
    if (ok && data) {
      setRelation(data);
    }
  };

  const follow = async () => {
    setRelation(undefined);
    const { data, ok } = await followById(userId);
    if (ok && data) {
      setRelation(data);
    }
  };

  const handleMute = async () => {
    setRelation(undefined);
    if (relation?.muting) {
      const { data, ok } = await unmute(userId);
      if (ok && data) {
        setRelation(data);
      }
    } else {
      const { data, ok } = await mute(userId);
      if (ok && data) {
        setRelation(data);
      }
    }
  };

  const handleBlock = async () => {
    setRelation(undefined);
    if (relation?.blocking) {
      const { data, ok } = await unblock(userId);
      if (ok && data) {
        setRelation(data);
      }
    } else {
      const { data, ok } = await block(userId);
      if (ok && data) {
        setRelation(data);
      }
    }
  };

  const handleDeleteStatus = async () => {
    const { data, ok } = await deleteStatus(statusId);
    if (ok && data) {
      Toast.show("删除嘟文成功");
    }
    PopOptonsUtil.hide();
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={98} tint="light">
        {isSelf ? null : (
          <>
            {!relation ? (
              <View style={styles.item}>
                <ActivityIndicator />
              </View>
            ) : relation?.following ? (
              <TouchableOpacity style={styles.item} onPress={unfollow}>
                <Text style={styles.text}>取消关注该用户</Text>
                <Icon name="unfollow" color="#333" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.item} onPress={follow}>
                <Text style={styles.text}>关注该用户</Text>
                <Icon name="follow" color="#333" />
              </TouchableOpacity>
            )}
            <SpacingBox height={5} color="#e9e9e9" />
          </>
        )}
        {isSelf ? (
          <>
            <TouchableOpacity style={styles.item} onPress={handleDeleteStatus}>
              <Text style={styles.text}>删除本条嘟文</Text>
              <Icon name="delete" color="#333" />
            </TouchableOpacity>
            <SpacingBox height={5} color="#e9e9e9" />
          </>
        ) : null}
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>提及</Text>
          <Icon name="aite" color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item} onPress={handleMute}>
          <Text style={styles.text}>
            {relation?.muting ? "取消屏蔽" : "屏蔽"}
          </Text>
          <Icon name="mute" size={22} color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item} onPress={handleBlock}>
          <Text style={[styles.text, { color: "red" }]}>
            {relation?.blocking ? "取消拉黑" : "拉黑"}
          </Text>
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
  template: (measurement: MeasuredDimensions, params: PopOptionsProps) => {
    return (
      <PopOptionsContainer
        duration={200}
        mask={false}
        measurement={measurement}
      >
        <PopOptions {...{ ...params }} />
      </PopOptionsContainer>
    );
  },
  show: (measurement: MeasuredDimensions, params: PopOptionsProps) => {
    ModalUtil.add(
      PopOptonsUtil.template(measurement, params),
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
