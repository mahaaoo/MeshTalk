import { Tabs, Redirect, router } from "expo-router";
import React from "react";

import { Icon } from "../../components/Icon";
import useAccountStore from "../../store/useAccountStore";

const TabRouter: React.FC<object> = () => {
  const { currentAccount } = useAccountStore();
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
          title: "主页",
          tabBarIcon: ({ color }) => (
            <Icon name="elephant" size={33} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="public"
        options={{
          title: "跨站",
          tabBarIcon: ({ color }) => (
            <Icon name="areas" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          tabBarLabel: "新嘟文",
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
          tabBarLabel: "通知",
          tabBarIcon: ({ color }) => (
            <Icon name="notify" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: "设置",
          tabBarIcon: ({ color }) => (
            <Icon name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabRouter;
