import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";

import { Icon } from "../components/Icon";
import Found from "../pages/found";
import Home from "../pages/home";
import AllNotify from "../pages/notify/allNotify";
import Publish from "../pages/publish";
import Setting from "../pages/setting";

const TabStack = createBottomTabNavigator();

const tabBarIconByType = (route: RouteProp<any>, color: string) => {
  if (route.name === "Home") {
    return <Icon name="home" size={25} color={color} />;
  }
  if (route.name === "Found") {
    return <Icon name="find" size={25} color={color} />;
  }
  if (route.name === "New") {
    return (
      <View style={styles.new}>
        <Icon name="plus" size={20} color="#fff" />
      </View>
    );
  }
  if (route.name === "Notify") {
    return <Icon name="notify" size={25} color={color} />;
  }
  if (route.name === "Setting") {
    return <Icon name="user" size={25} color={color} />;
  }
  return null;
};

const TabRouter: React.FC<object> = () => {
  return (
    <TabStack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2593FC",
        tabBarInactiveTintColor: "#999999",
        tabBarIcon: ({ color }) => tabBarIconByType(route, color),
      })}
    >
      <TabStack.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: "首页" }}
      />
      <TabStack.Screen
        name="Found"
        component={Found}
        options={{ tabBarLabel: "发现" }}
      />
      <TabStack.Screen
        name="New"
        component={Publish}
        options={{
          tabBarLabel: "新推文",
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Publish");
          },
        })}
      />
      <TabStack.Screen
        name="Notify"
        component={AllNotify}
        options={{ tabBarLabel: "通知" }}
      />
      <TabStack.Screen
        name="Setting"
        component={Setting}
        options={{ tabBarLabel: "设置" }}
      />
    </TabStack.Navigator>
  );
};

const styles = StyleSheet.create({
  new: {
    backgroundColor: "#2593FC",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default TabRouter;
