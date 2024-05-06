import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import React from "react";

import { Icon } from "../components/Icon";
import Found from "../pages/found";
import Home from "../pages/home";
import AllNotify from "../pages/notify/allNotify";
import Publish from "../pages/publish";
import Setting from "../pages/setting";

const TabStack = createBottomTabNavigator();

const tabBarIconByType = (route: RouteProp<any>, color: string) => {
  if (route.name === "Home") {
    return <Icon name="elephant" size={33} color={color} />;
  }
  if (route.name === "Found") {
    return <Icon name="areas" size={22} color={color} />;
  }
  if (route.name === "New") {
    return <Icon name="plane" size={26} color={color} />;
  }
  if (route.name === "Notify") {
    return <Icon name="notify" size={25} color={color} />;
  }
  if (route.name === "Setting") {
    return <Icon name="user" size={22} color={color} />;
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
        options={{ tabBarLabel: "本站" }}
      />
      <TabStack.Screen
        name="Found"
        component={Found}
        options={{ tabBarLabel: "跨站" }}
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

export default TabRouter;
