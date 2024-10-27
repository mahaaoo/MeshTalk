import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { Toast } from "react-native-ma-modal";
import * as Clipboard from "expo-clipboard";

import { PopOptonsUtil } from ".";
import { Account, Relationship, Timelines } from "../../config/interface";
import {
  getRelationships,
  unfollowById,
  followById,
  unmute,
  mute,
  unblock,
  block,
} from "../../server/account";
import { deleteStatus, pinStatus, unpinStatus } from "../../server/status";
import useAccountStore from "../../store/useAccountStore";
import useI18nStore from "../../store/useI18nStore";
import { Icon } from "../Icon";
import SpacingBox from "../SpacingBox";
import SplitLine from "../SplitLine";
import { openURL } from "@utils/media";

export interface PopOptionsProps {
  account: Account;
  item: Timelines;
}

const PopOptions: React.FC<PopOptionsProps> = (props) => {
  // const { userId, acct, statusId } = props;
  const { account, item } = props;
  const [relation, setRelation] = useState<Relationship>();
  const { currentAccount } = useAccountStore();
  const { i18n } = useI18nStore();
  const isSelf = useMemo(() => {
    // 该条嘟文所属的用户，是否和登录用户一致，即只能删除本人发出的嘟文
    return currentAccount?.acct === account.acct;
  }, [account, currentAccount]);

  useEffect(() => {
    const fetchRelation = async () => {
      const { data, ok } = await getRelationships(account.id);
      if (ok && data) {
        setRelation(data[0]);
      }
    };

    !isSelf && fetchRelation();
  }, [account, isSelf]);

  const unfollow = async () => {
    setRelation(undefined);
    const { data, ok } = await unfollowById(account.id);
    if (ok && data) {
      setRelation(data);
    }
  };

  const follow = async () => {
    setRelation(undefined);
    const { data, ok } = await followById(account.id);
    if (ok && data) {
      setRelation(data);
    }
  };

  const handleMute = async () => {
    setRelation(undefined);
    if (relation?.muting) {
      const { data, ok } = await unmute(account.id);
      if (ok && data) {
        setRelation(data);
      }
    } else {
      const { data, ok } = await mute(account.id);
      if (ok && data) {
        setRelation(data);
      }
    }
  };

  const handleBlock = async () => {
    setRelation(undefined);
    if (relation?.blocking) {
      const { data, ok } = await unblock(account.id);
      if (ok && data) {
        setRelation(data);
      }
    } else {
      const { data, ok } = await block(account.id);
      if (ok && data) {
        setRelation(data);
      }
    }
  };

  const handleDeleteStatus = async () => {
    const { data, ok } = await deleteStatus(item.id);
    if (ok && data) {
      Toast.show("删除嘟文成功");
    }
    PopOptonsUtil.hide();
  };

  const handlePin = async () => {
    if (item.pinned) {
      const { ok, data } = await unpinStatus(item.id);
      if (ok && data) {
        Toast.show("取消置顶嘟文成功");
      }
    } else {
      const { ok, data } = await pinStatus(item.id);
      if (ok && data) {
        Toast.show("置顶嘟文成功");
      }
    }
    PopOptonsUtil.hide();
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.url);
    PopOptonsUtil.hide();
    Toast.show("已复制到粘贴板");
  };

  const handleBrowser = async () => {
    openURL(item.url);
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
                <Text style={styles.text}>
                  {i18n.t("status_options_item_unfollow")}
                </Text>
                <Icon name="unfollow" color="#333" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.item} onPress={follow}>
                <Text style={styles.text}>
                  {i18n.t("status_options_item_follow")}
                </Text>
                <Icon name="follow" color="#333" />
              </TouchableOpacity>
            )}
            <SpacingBox height={5} color="#e9e9e9" />
          </>
        )}
        {isSelf ? (
          <>
            <TouchableOpacity style={styles.item} onPress={handleDeleteStatus}>
              <Text style={styles.text}>
                {i18n.t("status_options_item_delete")}
              </Text>
              <Icon name="delete" color="#333" />
            </TouchableOpacity>
            <SpacingBox height={5} color="#e9e9e9" />
          </>
        ) : null}
        {isSelf ? (
          <TouchableOpacity style={styles.item} onPress={handlePin}>
            <Text style={styles.text}>
              {item.pinned
                ? i18n.t("status_options_item_unpin")
                : i18n.t("status_options_item_pin")}
            </Text>
            <Icon name="pin" color="#333" />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.item} onPress={handleCopy}>
          <Text style={styles.text}>
            {i18n.t("status_options_item_copy_link")}
          </Text>
          <Icon name="link" color="#333" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={handleBrowser}>
          <Text style={styles.text}>
            {i18n.t("status_options_item_open_link")}
          </Text>
          <Icon name="browser" color="#333" size={22} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.text}>
            {i18n.t("status_options_item_mention")}
          </Text>
          <Icon name="aite" color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item} onPress={handleMute}>
          <Text style={styles.text}>
            {relation?.muting
              ? i18n.t("status_options_item_unmute")
              : i18n.t("status_options_item_mute")}
          </Text>
          <Icon name="mute" size={22} color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item} onPress={handleBlock}>
          <Text style={[styles.text, { color: "red" }]}>
            {relation?.blocking
              ? i18n.t("status_options_item_unblock")
              : i18n.t("status_options_item_block")}
          </Text>
          <Icon name="block" size={20} color="#333" />
        </TouchableOpacity>
        <SplitLine start={10} end={210} />
        <TouchableOpacity style={styles.item}>
          <Text style={[styles.text, { color: "red" }]}>
            {i18n.t("status_options_item_report")}
          </Text>
          <Icon name="report" size={20} color="#333" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    width: 240,
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

export default PopOptions;
