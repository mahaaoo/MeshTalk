import React, { useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

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
import { Screen, Colors } from "../../config";
import { Timelines } from "../../config/interface";
import { replaceContentEmoji, DateUtil, navigate } from "../../utils";

interface HomeLineItemProps {
  item: Timelines;
  needToolbar?: boolean; // 是否显示转发工具条
}

const HomeLineItem: React.FC<HomeLineItemProps> = (props) => {
  const { item, needToolbar = true } = props;
  const showItem = item?.reblog || item;

  const handleAvatar = useCallback(() => {
    navigate("User", { id: item?.account.id });
  }, [item]);

  const handleNavigation = useCallback(() => {
    needToolbar && navigate("StatusDetail", { id: item?.id });
  }, [needToolbar, item]);

  return (
    <View style={styles.main} key={showItem?.id}>
      <TouchableOpacity activeOpacity={1} onPress={handleNavigation}>
        {item?.reblog ? (
          <View style={styles.status}>
            <Icon name="turn" size={20} color="#fff" />
            <Text style={styles.turnText}>
              {item.account?.display_name || item.account?.username} 转发了
            </Text>
          </View>
        ) : null}
        {item?.in_reply_to_id ? (
          <View style={styles.status}>
            <Icon name="comment" size={20} color="#fff" />
            <Text style={styles.commentText}>
              {item.account?.display_name || item.account?.username} 转评了
            </Text>
          </View>
        ) : null}
        <View style={styles.content}>
          <View style={styles.title}>
            <TouchableOpacity style={styles.avatar} onPress={handleAvatar}>
              <Avatar url={showItem?.account?.avatar} />
            </TouchableOpacity>
            <View style={styles.name}>
              <View style={styles.nameContainer}>
                <View style={styles.nameView}>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    <LineItemName
                      displayname={
                        showItem?.account?.display_name ||
                        showItem?.account?.username
                      }
                    />
                    <Text style={styles.mentionText}>
                      {`@${showItem?.account?.acct}`}
                    </Text>
                  </Text>
                </View>
                <Icon name="arrowDown" size={18} color="#ddd" />
              </View>
              <View style={styles.sourceContainer}>
                <Text style={styles.sourceText}>
                  {DateUtil.dateToFromNow(showItem?.created_at)}
                  {showItem?.application ? (
                    <Text style={styles.nameText}>
                      &nbsp;&nbsp;来自
                      <Text style={{ color: Colors.linkTagColor }}>
                        {showItem?.application?.name}
                      </Text>
                    </Text>
                  ) : (
                    <View />
                  )}
                </Text>
              </View>
            </View>
          </View>
          <HTMLContent html={replaceContentEmoji(showItem?.content)} />
          <NinePicture imageList={showItem?.media_attachments} />
          {showItem?.media_attachments?.length === 0 ? (
            <WebCard card={showItem?.card} />
          ) : null}
          <SplitLine start={0} end={Screen.width - 30} />
          {needToolbar ? (
            <ToolBar
              favourited={showItem?.favourited}
              favourites_count={showItem?.favourites_count}
              reblogs_count={showItem?.reblogs_count}
              replies_count={showItem?.replies_count}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  status: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: Colors.timelineStatusTag,
    marginTop: 15,
    height: 30,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: "center",
  },
  main: {
    backgroundColor: Colors.defaultWhite,
    marginBottom: 10,
    width: Screen.width,
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
    color: Colors.defaultWhite,
    marginLeft: 2,
  },
  commentText: {
    color: Colors.defaultWhite,
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
  },
  sourceText: {
    fontSize: 13,
    color: Colors.commonToolBarText,
    marginTop: 8,
  },
  nameText: {
    fontSize: 12,
  },
});

export default HomeLineItem;
