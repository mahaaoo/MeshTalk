import { acctName } from "@utils/string";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Avatar, Button, SplitLine } from "../../components";
import { Colors } from "../../config";
import { Account } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import UserName from "../home/userName";

interface ButtonOption {
  onPress: () => void;
  title: string;
}
interface UserItemProps {
  item: Account;
  showButton?: boolean;
  buttonOption?: ButtonOption;
}

const UserItem: React.FC<UserItemProps> = (props) => {
  const { item, showButton = false, buttonOption } = props;
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
        {showButton ? (
          <Button
            text={buttonOption?.title || ""}
            onPress={() => buttonOption?.onPress && buttonOption?.onPress()}
            style={{
              paddingVertical: 3,
              paddingHorizontal: 10,
              height: 35,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderRadius: 20,
              borderColor: Colors.defaultLineGreyColor,
            }}
            textStyle={{
              fontSize: 14,
              color: Colors.grayTextColor,
            }}
          />
        ) : null}
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
    alignItems: "center",
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
