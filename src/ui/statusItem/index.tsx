import { Avatar, SplitLine, NinePicture, HTMLContent } from "@components";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { styles } from "./index.style";
import ReplyName from "./replyName";
import StatusOptions from "./statusOptions";
import ToolBar from "./toolBar";
import WebCard from "./webCard";
import { Colors } from "../../config";
import { Timelines } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import { replaceContentEmoji, DateUtil } from "../../utils";
import UserName from "../home/userName";

interface StatusItemProps {
  item: Timelines;
  needToolbar?: boolean; // 是否显示转发工具条
  sameUser?: boolean; // 是否是同一个用户，在user中会用
}

const StatusItem: React.FC<StatusItemProps> = (props) => {
  const { item, needToolbar = true, sameUser = false } = props;
  const showItem = item.reblog || item;
  const { width } = useDeviceStore();

  const handleAvatar = useCallback(() => {
    console.log(sameUser);
    if (sameUser) return;
    router.push({
      pathname: "/user/[id]",
      params: {
        id: showItem.account.id,
        acct: showItem.account.acct,
      },
    });
  }, [item, sameUser]);

  const handleNavigation = useCallback(() => {
    needToolbar &&
      router.push({
        pathname: "/status/[id]",
        params: {
          id: showItem.id,
        },
      });
  }, [needToolbar, item]);

  return (
    <View style={styles.main} key={showItem.id}>
      <TouchableOpacity activeOpacity={1} onPress={handleNavigation}>
        {item.reblog ? (
          <ReplyName
            displayName={item.account.display_name || item.account.username}
            emojis={showItem.account.emojis}
            type="转发了"
          />
        ) : null}
        {item.in_reply_to_id ? (
          <ReplyName
            displayName={item.account.display_name || item.account.username}
            emojis={showItem.account.emojis}
            type="转评了"
          />
        ) : null}
        <View style={styles.content}>
          <View style={styles.title}>
            <TouchableOpacity style={styles.avatar} onPress={handleAvatar}>
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
                  <Text style={styles.mentionText}>
                    {`@${showItem.account.acct}`}
                  </Text>
                </View>
                <Text style={styles.sourceText}>
                  {DateUtil.dateToFromNow(showItem.created_at)}
                </Text>
              </View>
            </View>
          </View>

          <HTMLContent
            id={item.id}
            blur={showItem.sensitive && showItem.spoiler_text.length > 0}
            spoilerText={showItem.spoiler_text}
            html={replaceContentEmoji(showItem.content, showItem.emojis)}
          />

          <View style={{ paddingVertical: 8 }}>
            <NinePicture
              sensitive={
                // 如果设置为了敏感内容，并且无敏感提示词，则认为媒体信息为敏感信息
                showItem.sensitive && showItem.spoiler_text.length === 0
              }
              id={item.id}
              imageList={showItem.media_attachments}
            />
          </View>

          {showItem.media_attachments.length === 0 ? (
            <WebCard card={showItem.card} />
          ) : null}

          {showItem.application ? (
            <View
              style={{
                width: "100%",
                paddingBottom: 8,
                alignItems: "flex-end",
              }}
            >
              <Text style={styles.nameText}>
                &nbsp;&nbsp;来自
                <Text style={{ color: Colors.linkTagColor }}>
                  {showItem.application.name}
                </Text>
              </Text>
            </View>
          ) : null}

          <SplitLine start={0} end={width - 30} />

          {needToolbar ? (
            <ToolBar
              id={showItem.id}
              favourited={showItem.favourited}
              favourites_count={showItem.favourites_count}
              reblogged={showItem.reblogged}
              reblogs_count={showItem.reblogs_count}
              replies_count={showItem.replies_count}
            />
          ) : null}
        </View>
      </TouchableOpacity>
      <StatusOptions acct={showItem.account.acct} />
    </View>
  );
};

export default StatusItem;
