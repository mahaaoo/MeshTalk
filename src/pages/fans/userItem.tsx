import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Avatar, SplitLine } from "../../components";
import { Screen, Colors } from "../../config";
import { Account } from "../../config/interface";
import { navigate } from "../../utils";
import LineItemName from "../home/lineItemName";

interface UserItemProps {
  item: Account;
}

const UserItem: React.FC<UserItemProps> = (props) => {
  const { item } = props;

  const handleNavigation = useCallback(() => {
    navigate("User", { id: item.id });
  }, []);

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View style={styles.container}>
        <View>
          <Avatar url={item.avatar} />
        </View>
        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <LineItemName
              displayname={item?.display_name || item?.username}
              emojis={item?.emojis}
              fontSize={18}
            />
          </View>
          <Text style={styles.acct}>
            <Text>@</Text>
            {item?.acct}
          </Text>
        </View>
      </View>
      <SplitLine start={0} end={Screen.width} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.defaultWhite,
    padding: 15,
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
