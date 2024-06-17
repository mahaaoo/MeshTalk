import UserName from "@ui/home/userName";
import { acctName } from "@utils/string";
import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { TranslateContainer, ModalUtil, Loading } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDLOGOUT } from "../../config/constant";
import useAccountStore from "../../store/useAccountStore";
import useAppStore from "../../store/useAppStore";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import Avatar from "../Avatar";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";

const LogoutComponent: React.FC<object> = () => {
  const { currentAccount } = useAccountStore();
  const { multipleUser, switchUser, exitCurrentAccount } = useAppStore();
  const { i18n } = useI18nStore();

  return (
    <View
      style={[
        styles.scrollViewContainer,
        { paddingBottom: useDeviceStore.getState().insets.bottom },
      ]}
    >
      <View style={styles.titleContainer} />
      <View style={styles.item}>
        {multipleUser.map((user) => {
          return (
            <View key={user.acct}>
              <TouchableOpacity
                onPress={() => {
                  if (user.acct !== acctName(currentAccount?.acct)) {
                    // 切换账号
                    Loading.show();
                    Logout.hide();
                    switchUser(user, true);
                    router.replace("/");
                  }
                }}
                style={styles.itemContainer}
              >
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <Avatar url={user.avatar} />
                  <View
                    style={{
                      marginHorizontal: 10,
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <UserName displayname={user.displayName} fontSize={16} />
                    <Text style={styles.acct}>{user.acct}</Text>
                  </View>
                </View>
                {user.acct === acctName(currentAccount?.acct) ? (
                  <Icon name="check" color={Colors.theme} />
                ) : null}
              </TouchableOpacity>
              <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
            </View>
          );
        })}
        <TouchableOpacity
          onPress={() => {
            Logout.hide();
            router.push("/welcome");
          }}
          style={styles.functionContainer}
        >
          <Text style={styles.itemTitle}>{i18n.t("switch_account_add")}</Text>
        </TouchableOpacity>
        <SplitLine start={0} end={useDeviceStore.getState().width - 40} />
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              i18n.t("alert_title_text"),
              i18n.t("switch_account_alert"),
              [
                {
                  text: i18n.t("alert_cancel_text"),
                },
                {
                  style: "destructive",
                  text: i18n.t("alert_confim_text"),
                  onPress: () => {
                    Logout.hide();
                    Loading.show();
                    exitCurrentAccount(acctName(currentAccount?.acct));
                  },
                },
              ],
            );
          }}
          style={styles.functionContainer}
        >
          <Text style={styles.itemTitle}>
            {i18n.t("switch_account_logout")}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          Logout.hide();
        }}
        style={[styles.item, styles.cacelButton]}
      >
        <Text style={styles.itemTitle}>{i18n.t("switch_account_cancel")}</Text>
      </TouchableOpacity>
    </View>
  );
};

const Logout = {
  key: ACTIONMODALIDLOGOUT,
  template: () => {
    return (
      <TranslateContainer onDisappear={() => {}} gesture>
        <LogoutComponent />
      </TranslateContainer>
    );
  },
  show: () => {
    ModalUtil.add(Logout.template(), Logout.key);
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
