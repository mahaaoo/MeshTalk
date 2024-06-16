import { Tabs, Redirect, router } from "expo-router";
import React from "react";

import ActionsSheet from "../../components/ActionsSheet";
import { Icon } from "../../components/Icon";
import useAccountStore from "../../store/useAccountStore";
import useI18nStore from "../../store/useI18nStore";

const TabRouter: React.FC<object> = () => {
  const { currentAccount } = useAccountStore();
  const { i18n } = useI18nStore();
  if (!currentAccount) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2593FC",
        tabBarInactiveTintColor: "#999999",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t("tabbar_icon_home"),
          tabBarIcon: ({ color }) => (
            <Icon name="elephant" size={33} color={color} />
          ),
        }}
        listeners={() => ({
          tabLongPress: () => {
            ActionsSheet.Logout.show();
          },
        })}
      />
      <Tabs.Screen
        name="public"
        options={{
          tabBarLabel: i18n.t("tabbar_icon_public"),
          tabBarIcon: ({ color }) => (
            <Icon name="areas" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          tabBarLabel: i18n.t("tabbar_icon_new"),
          tabBarIcon: ({ color }) => (
            <Icon name="plane" size={26} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push("/publish");
          },
        })}
      />
      <Tabs.Screen
        name="notify"
        options={{
          tabBarLabel: i18n.t("tabbar_icon_notify"),
          tabBarIcon: ({ color }) => (
            <Icon name="notify" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: i18n.t("tabbar_icon_setting"),
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabRouter;
