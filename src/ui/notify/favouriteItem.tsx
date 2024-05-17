import React from "react";
import { View, StyleSheet, Text } from "react-native";

import { Avatar, SplitLine, HTMLContent, Icon } from "../../components";
import { Colors } from "../../config";
import { Notification } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import { replaceContentEmoji } from "../../utils";
import UserName from "../home/userName";

const tagsStyles = {
  p: {
    fontSize: 16,
    lineHeight: 20,
    color: Colors.grayTextColor,
  },
  a: {
    fontSize: 16,
    lineHeight: 20,
    textDecorationLine: "none",
    color: Colors.grayTextColor,
  },
};

interface FavouriteItemProps {
  item: Notification;
}

const FavouriteItem: React.FC<FavouriteItemProps> = (props) => {
  const { item } = props;
  const { width } = useDeviceStore();
  return (
    <View style={styles.main}>
      <View style={styles.content}>
        <View style={styles.typeLogo}>
          <Icon name="likeFill" size={23} color="red" />
        </View>
        <View style={styles.right}>
          <Avatar url={item.account?.avatar} />
          <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
            <UserName
              displayname={item.account?.display_name || item.account?.username}
              emojis={item.account?.emojis}
              fontSize={15}
            />
            <Text style={styles.explan}>&nbsp; 喜欢了你的嘟文</Text>
          </Text>
          <HTMLContent
            html={replaceContentEmoji(
              item.status?.content,
              item.status?.emojis,
            )}
            tagsStyles={tagsStyles}
          />
        </View>
      </View>
      <SplitLine start={0} end={width} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.defaultWhite,
    width: useDeviceStore.getState().width,
  },
  content: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  username: {
    marginTop: 10,
  },
  explan: {
    fontWeight: "normal",
    fontSize: 15,
  },
  typeLogo: {
    width: 50,
    alignItems: "flex-end",
    marginRight: 10,
  },
  right: {
    flex: 1,
  },
});

export default FavouriteItem;
