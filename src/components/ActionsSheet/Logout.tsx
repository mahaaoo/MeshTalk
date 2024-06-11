import UserName from "@ui/home/userName";
import { acctName } from "@utils/string";
import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDLOGOUT } from "../../config/constant";
import useAccountStore from "../../store/useAccountStore";
import useAppStore from "../../store/useAppStore";
import useDeviceStore from "../../store/useDeviceStore";
import Avatar from "../Avatar";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";

type ActionsSheetTyps = {
  onExitCurrentAccount: () => void;
  onAddNewAccount: () => void;
  onSwitchAccount: () => void;
};

const Logout = {
  key: ACTIONMODALIDLOGOUT,
  template: ({
    onExitCurrentAccount,
    onAddNewAccount,
    onSwitchAccount,
  }: ActionsSheetTyps) => {
    const { currentAccount } = useAccountStore.getState();
    return (
      <TranslateContainer onDisappear={() => {}} gesture>
        <View
          style={[
            styles.scrollViewContainer,
            { paddingBottom: useDeviceStore.getState().insets.bottom },
          ]}
        >
          <View style={styles.titleContainer} />
          <View style={styles.item}>
            <TouchableOpacity
              onPress={onSwitchAccount}
              style={styles.itemContainer}
            >
              <View style={{ flexDirection: "row", flex: 1 }}>
                <Avatar url={currentAccount?.avatar} />
                <View style={{ marginHorizontal: 10, flex: 1 }}>
                  <UserName
                    displayname={
                      currentAccount?.display_name! || currentAccount?.username!
                    }
                    emojis={currentAccount?.emojis!}
                    fontSize={16}
                  />
                  <Text style={styles.acct}>
                    {acctName(currentAccount?.acct)}
                  </Text>
                </View>
              </View>
              <Icon name="check" color={Colors.theme} />
            </TouchableOpacity>
            <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
            <TouchableOpacity
              onPress={onAddNewAccount}
              style={styles.functionContainer}
            >
              <Text style={styles.itemTitle}>添加已有账号</Text>
            </TouchableOpacity>
            <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
            <TouchableOpacity
              onPress={onExitCurrentAccount}
              style={styles.functionContainer}
            >
              <Text style={styles.itemTitle}>退出当前账号</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              Logout.hide();
            }}
            style={[styles.item, styles.cacelButton]}
          >
            <Text style={styles.itemTitle}>取消</Text>
          </TouchableOpacity>
        </View>
      </TranslateContainer>
    );
  },
  show: () => {
    const { exitCurrentAccount } = useAppStore.getState();
    const params = {
      onAddNewAccount: () => {
        Logout.hide();
        // router.push("/login");

        router.push("/welcome");
      },
      onSwitchAccount: () => {},
      onExitCurrentAccount: () => {
        Alert.alert("提示", "确定要退出当前账号，下次需要重新登录", [
          {
            text: "取消",
          },
          {
            text: "确定",
            onPress: () => {
              exitCurrentAccount();
            },
          },
        ]);
      },
    };
    ModalUtil.add(Logout.template(params), Logout.key);
  },
  hide: () => ModalUtil.remove(Logout.key || ""),
  isExist: () => ModalUtil.isExist(Logout.key || ""),
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    width: useDeviceStore.getState().width,
  },
  titleContainer: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.defaultLineGreyColor,
    marginVertical: 10,
  },
  item: {
    width: useDeviceStore.getState().width - 40,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  functionContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
  },
  acct: {
    fontSize: 13,
    color: Colors.grayTextColor,
  },
  cacelButton: {
    marginTop: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Logout;
