import { Avatar, FollowButton, HTMLContent, Icon } from "@components";
import UserName from "@ui/home/userName";
import { StringUtil, replaceContentEmoji } from "@utils/index";
import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

import { Colors } from "../../config";
import { Account } from "../../config/interface";

interface UserHeadProps {
  userData: Account;
  isSelf: boolean;
  onAvatarPress: (url: string) => void;
}

const UserHead: React.FC<UserHeadProps> = (props) => {
  const { userData, isSelf = false, onAvatarPress } = props;

  return (
    <>
      <View style={styles.title}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => onAvatarPress(userData?.avatar)}
          >
            <Avatar
              url={userData?.avatar}
              size={65}
              borderColor="#fff"
              borderWidth={4}
            />
          </TouchableOpacity>
          {userData?.locked ? (
            // 锁定
            <View style={{ margin: 3 }}>
              <Icon name="lock" size={20} color="#aaa" />
            </View>
          ) : null}
          {userData?.bot ? (
            // 机器人
            <View style={{ margin: 3 }}>
              <Icon name="robot" size={22} color="#aaa" />
            </View>
          ) : null}
        </View>

        {!isSelf ? (
          <FollowButton id={userData?.id} locked={userData?.locked} />
        ) : null}
      </View>
      <View style={{ marginTop: 5, flexDirection: "row" }}>
        <Text numberOfLines={10}>
          <UserName
            displayname={userData?.display_name || userData?.username}
            emojis={userData?.emojis}
            fontSize={18}
          />
        </Text>
      </View>
      <Text style={styles.acct}>{StringUtil.acctName(userData?.acct)}</Text>

      <HTMLContent
        html={replaceContentEmoji(userData?.note, userData?.emojis)}
      />

      {userData?.fields?.length > 0
        ? userData?.fields?.map((field, index) => {
            return (
              <View
                key={`fields${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 3,
                }}
              >
                <View style={{ width: 100 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.grayTextColor,
                      fontWeight: "bold",
                    }}
                  >
                    {field.name}
                  </Text>
                </View>
                <View
                  style={{
                    marginHorizontal: 5,
                    height: "100%",
                    width: 1.5,
                    backgroundColor: Colors.grayTextColor,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <HTMLContent
                    html={replaceContentEmoji(field.value, userData?.emojis)}
                  />
                </View>
              </View>
            );
          })
        : null}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  avatar: {
    marginTop: -20,
  },
  acct: {
    fontSize: 14,
    color: Colors.grayTextColor,
    marginTop: 5,
  },
});

export default UserHead;
