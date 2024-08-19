import { router } from "expo-router";
import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Loading } from "react-native-ma-modal";

import UserName from "@ui/home/userName";
import { acctName } from "@utils/string";

import { Colors } from "../../config";
import useAccountStore from "../../store/useAccountStore";
import useAppStore from "../../store/useAppStore";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import Avatar from "../Avatar";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";
import OptionSheet from "./OptionSheet";

const LogoutComponent: React.FC<object> = () => {
  const { currentAccount } = useAccountStore();
  const { multipleUser, switchUser, exitCurrentAccount } = useAppStore();
  const { i18n } = useI18nStore();

  return (
    <>
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
        <Text style={styles.itemTitle}>{i18n.t("switch_account_logout")}</Text>
      </TouchableOpacity>
    </>
  );
};

const Logout = {
  show: () => {
    OptionSheet.show({
      needCancle: true,
      items: <LogoutComponent />,
    });
  },
  hide: OptionSheet.hide,
};

const styles = StyleSheet.create({
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
});

export default Logout;
