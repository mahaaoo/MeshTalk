import { router } from "expo-router";
import React, { useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import LineItemName from "./lineItemName";
import ToolBar from "./toolBar";
import WebCard from "./webCard";
import {
  Avatar,
  SplitLine,
  NinePicture,
  HTMLContent,
  Icon,
} from "../../components";
import { Colors } from "../../config";
import { Timelines } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import { replaceContentEmoji, DateUtil } from "../../utils";

interface TimeLineItemProps {
  item: Timelines;
  needToolbar?: boolean; // 是否显示转发工具条
}

const TimeLineItem: React.FC<TimeLineItemProps> = (props) => {
  const { item, needToolbar = true } = props;
  const showItem = item.reblog || item;
  const { width } = useDeviceStore();

  const handleAvatar = useCallback(() => {
    router.push({
      pathname: "/user/[id]",
      params: {
        id: item.account.id,
        acct: item.account.acct,
      },
    });
  }, [item]);

  const handleNavigation = useCallback(() => {
    needToolbar &&
      router.push({
        pathname: "/status/[id]",
        params: {
          id: item.id,
        },
      });
  }, [needToolbar, item]);

  return (
    <View style={styles.main} key={showItem.id}>
      <TouchableOpacity activeOpacity={1} onPress={handleNavigation}>
        {item.reblog ? (
          <View style={styles.status}>
            <Icon name="turn" size={20} color={Colors.commonToolBarText} />
            <Text style={styles.turnText}>
              {item.account.display_name || item.account.username} 转发了
            </Text>
          </View>
        ) : null}
        {item.in_reply_to_id ? (
          <View style={styles.status}>
            <Icon name="comment" size={20} color={Colors.commonToolBarText} />
            <Text style={styles.commentText}>
              {item.account.display_name || item.account.username} 转评了
            </Text>
          </View>
        ) : null}
        <View style={styles.content}>
          <View style={styles.title}>
            <TouchableOpacity style={styles.avatar} onPress={handleAvatar}>
              <Avatar url={showItem.account.avatar} />
            </TouchableOpacity>
            <View style={styles.name}>
              <View style={styles.nameContainer}>
                <View style={styles.nameView}>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    <LineItemName
                      displayname={
                        showItem.account.display_name ||
                        showItem.account.username
                      }
                      emojis={showItem.account.emojis}
                    />
                  </Text>
                </View>
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
          <HTMLContent html={replaceContentEmoji(showItem.content)} />
          <View style={{ paddingVertical: 8 }}>
            <NinePicture imageList={showItem.media_attachments} />
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
              reblogs_count={showItem.reblogs_count}
              replies_count={showItem.replies_count}
            />
          ) : null}
        </View>
      </TouchableOpacity>
      <View style={styles.more}>
        <Icon name="three_point" size={18} color="#bbb" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    flexDirection: "row",
    marginTop: 8,
    alignItems: "flex-start",
    marginLeft: 5,
    marginRight: 50,
  },
  main: {
    backgroundColor: Colors.defaultWhite,
    marginBottom: 10,
    width: useDeviceStore.getState().width,
  },
  title: {
    flexDirection: "row",
    paddingTop: 15,
  },
  avatar: {
    paddingRight: 10,
  },
  name: {
    justifyContent: "center",
    flex: 1,
  },
  turnText: {
    color: Colors.commonToolBarText,
    marginLeft: 2,
  },
  commentText: {
    color: Colors.commonToolBarText,
    marginLeft: 2,
  },
  content: {
    marginHorizontal: 15,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameView: {
    flex: 1,
  },
  mentionText: {
    color: Colors.commonToolBarText,
    fontSize: 14,
  },
  sourceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceView: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceText: {
    fontSize: 12,
    color: Colors.commonToolBarText,
    marginLeft: 8,
  },
  nameText: {
    fontSize: 12,
    color: Colors.commonToolBarText,
  },
  more: {
    position: "absolute",
    right: 15,
    top: 15,
  },
});

export default TimeLineItem;