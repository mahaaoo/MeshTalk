import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import TabRoutes from "./tabRoutes";
import routes, { StackParams } from "../pages";

const Stack = createNativeStackNavigator<StackParams>();
const PagesRouter: React.FC<object> = () => {
  return (
    <Stack.Navigator
      initialRouteName="App"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="App"
        component={TabRoutes}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Group>
        {routes.map((item, i) => {
          return (
            <Stack.Screen
              name={item.name}
              component={item.component}
              options={item.options}
              key={`${i}`}
            />
          );
        })}
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default PagesRouter;
