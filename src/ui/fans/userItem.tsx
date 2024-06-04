import { acctName } from "@utils/string";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Avatar, SplitLine } from "../../components";
import { Colors } from "../../config";
import { Account } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import UserName from "../home/userName";

interface UserItemProps {
  item: Account;
}

const UserItem: React.FC<UserItemProps> = (props) => {
  const { item } = props;
  const { width } = useDeviceStore();

  const handleNavigation = useCallback(() => {
    router.push({
      pathname: "/user/[id]",
      params: {
        id: item.id,
        acct: item.acct,
      },
    });
  }, [item]);

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View style={styles.container}>
        <View>
          <Avatar url={item.avatar} />
        </View>
        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <UserName
              displayname={item?.display_name || item?.username}
              emojis={item?.emojis}
              fontSize={18}
            />
          </View>
          <Text style={styles.acct}>{acctName(item?.acct)}</Text>
        </View>
      </View>
      <SplitLine start={0} end={width} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.defaultWhite,
    padding: 15,
    width: useDeviceStore.getState().width,
  },
  acct: {
    fontSize: 14,
    color: Colors.grayTextColor,
    marginTop: 5,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default UserItem;
