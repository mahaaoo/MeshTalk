import { Avatar, SplitLine, NinePicture, HTMLContent } from "@components";
import { replaceContentEmoji, DateUtil, StringUtil } from "@utils/index";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { styles } from "./index.style";
import ReplyName from "./replyName";
import StatusOptions from "./statusOptions";
import ToolBar from "./toolBar";
import WebCard from "./webCard";
import { Colors } from "../../config";
import { Timelines } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import UserName from "../home/userName";
import usePreferenceStore from "../../store/usePreferenceStore";

interface StatusItemProps {
  item: Timelines;
  needToolbar?: boolean; // 是否显示转发工具条
  canToDetail?: boolean; // 是否可以点击跳转到详情
  isReply?: boolean; // 是否是回复的嘟文
  deep?: number; // 当前回复深度
  sameUser?: boolean; // 点击的嘟文是否当前用户用户，在user中会用
  needDivide?: boolean; // 是否需要和下个嘟文分开
  limit?: boolean;
}

const StatusItem: React.FC<StatusItemProps> = (props) => {
  const {
    item,
    needToolbar = true,
    sameUser = false,
    canToDetail = true,
    isReply = false,
    deep,
    needDivide = true,
    limit = true,
  } = props;
  const showItem = item.reblog || item;
  const { width } = useDeviceStore();
  const { i18n } = useI18nStore();
  const { sensitive } = usePreferenceStore();

  const units = useMemo(() => {
    return {
      days: i18n.t("status_time_days"),
      hours: i18n.t("status_time_hours"),
      minutes: i18n.t("status_time_minutes"),
      now: i18n.t("status_time_now"),
    };
  }, [i18n]);

  const handleAvatar = useCallback(() => {
    if (sameUser) return;
    router.push({
      pathname: "/user/[id]",
      params: {
        acct: showItem.account.acct,
      },
    });
  }, [sameUser, showItem]);

  const handleNavigation = useCallback(() => {
    if (!canToDetail) return;
    needToolbar &&
      router.push({
        pathname: "/status/[id]",
        params: {
          id: showItem.id,
        },
      });
  }, [canToDetail, needToolbar, showItem]);

  return (
    <View
      style={[styles.main, { marginBottom: isReply || !needDivide ? 0 : 10, width }]}
      key={showItem.id}
    >
      {isReply && deep && deep > 0 ? (
        <View
          style={{
            position: "absolute",
            left: 18,
            top: 0,
            bottom: 0,
            height: "100%",
            flexDirection: "row",
          }}
        >
          {new Array(deep).fill(0).map((_, index) => (
            <View
              key={index}
              style={{
                height: "100%",
                width: 2,
                backgroundColor: "#ccc",
                opacity: index === deep - 1 ? 1 : 0.5,
                marginLeft: 5,
              }}
            />
          ))}
        </View>
      ) : null}
      <TouchableOpacity activeOpacity={1} onPress={handleNavigation}>
        {!isReply && item.reblog ? (
          <ReplyName
            displayName={item.account.display_name || item.account.username}
            emojis={showItem.account.emojis}
            type={i18n.t("status_turn")}
          />
        ) : null}
        {!isReply && item.in_reply_to_id ? (
          <ReplyName
            displayName={item.account.display_name || item.account.username}
            emojis={showItem.account.emojis}
            type={i18n.t("status_comment")}
          />
        ) : null}
        <View style={styles.content}>
          <View style={styles.title}>
            <TouchableOpacity onPress={handleAvatar}>
              <Avatar url={showItem.account.avatar} />
            </TouchableOpacity>
            <View style={styles.name}>
              <View style={styles.nameContainer}>
                <Text
                  style={styles.nameView}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <UserName
                    displayname={
                      showItem.account.display_name || showItem.account.username
                    }
                    emojis={showItem.account.emojis}
                  />
                </Text>
              </View>
              <View style={styles.sourceContainer}>
                <View style={styles.sourceView}>
                  <Text
                    style={styles.mentionText}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {StringUtil.acctName(showItem.account.acct)}
                  </Text>
                </View>
                <Text style={styles.sourceText}>
                  {DateUtil.dateToFromNow(showItem.created_at, units)}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginLeft: isReply ? 55 : 0 }}>
            <HTMLContent
              id={item.id}
              blur={
                sensitive === true
                  ? false
                  : showItem.sensitive &&
                    showItem.media_attachments.length === 0
              }
              spoilerText={showItem.spoiler_text}
              html={replaceContentEmoji(showItem.content, showItem.emojis)}
              mentions={showItem.mentions}
              tags={showItem.tags}
              onReadMore={handleNavigation}
              limit={limit}
            />
            <View style={{ paddingVertical: 8 }}>
              <NinePicture
                sensitive={
                  // D：如果设置为了敏感内容，并且无敏感提示词，则认为媒体信息为敏感信息
                  // 只要设置了敏感信息，则隐藏
                  // 需要和本地存储的偏好设置一起判断
                  sensitive === true ? false : showItem.sensitive
                }
                id={item.id}
                imageList={showItem.media_attachments}
              />
            </View>

            {showItem.media_attachments.length === 0 ? (
              <WebCard card={showItem.card} />
            ) : null}
          </View>

          {showItem.application ? (
            <View
              style={{
                width: "100%",
                paddingBottom: 8,
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.nameText}>
                {i18n.t("status_origin")}&nbsp;&nbsp;
                <Text style={{ color: Colors.linkTagColor }}>
                  {showItem.application.name}
                </Text>
              </Text>
            </View>
          ) : null}

          <View style={{ marginLeft: isReply ? 55 : 0 }}>
            {needToolbar ? <ToolBar item={showItem} /> : null}
          </View>
        </View>
      </TouchableOpacity>
      <StatusOptions account={showItem.account} item={showItem} />
      <SplitLine start={isReply ? 55 : 0} end={width} />
    </View>
  );
};

export default StatusItem;
