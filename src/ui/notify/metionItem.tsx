import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import HTML from "react-native-render-html";

import { Avatar, SplitLine } from "../../components";
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

const renderer = {
  img: (htmlAttribs: any) => {
    return (
      <Image
        key={htmlAttribs.src}
        style={styles.htmlImage}
        resizeMode="contain"
        source={{ uri: htmlAttribs.src }}
      />
    );
  },
};

interface MetionItemProps {
  item: Notification;
}

const MetionItem: React.FC<MetionItemProps> = (props) => {
  const { item } = props;
  const { width } = useDeviceStore();

  return (
    <View style={styles.main}>
      <View style={styles.content}>
        <View style={styles.typeLogo}>
          <Image
            source={require("../../images/notify_turn.png")}
            style={styles.iconNotify}
          />
        </View>
        <View style={styles.right}>
          <Avatar url={item.account?.avatar} />
          <Text style={styles.username}>
            <UserName
              displayname={item.account?.display_name || item.account?.username}
              emojis={item.account?.emojis}
              fontSize={15}
            />
            <Text style={styles.explan}>&nbsp; 转发了你的嘟文</Text>
          </Text>
          <HTML
            source={{
              html: replaceContentEmoji(
                item.status?.content,
                item.status?.emojis,
              ),
            }}
            tagsStyles={tagsStyles}
            containerStyle={styles.htmlContainer}
            renderers={renderer}
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
    fontWeight: "bold",
    fontSize: 15,
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
  iconNotify: {
    width: 25,
    height: 25,
  },
  htmlImage: {
    height: 16,
    width: 16,
    alignSelf: "stretch",
  },
  htmlContainer: {
    paddingVertical: 15,
  },
});

export default MetionItem;
