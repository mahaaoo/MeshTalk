import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import TabRoutes from "./tabRoutes";
import { routes, StackParams } from "../pages";
import Guide from "../pages/guide";
import Login from "../pages/login";
import WebView from "../pages/webView";
import useAccountStore from "../store/useAccountStore";

const Stack = createNativeStackNavigator<StackParams>();
const PagesRouter: React.FC<object> = () => {
  const { currentAccount } = useAccountStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
      }}
    >
      {currentAccount ? (
        <>
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
        </>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="Guide"
            component={Guide}
            options={{ header: () => null }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ header: () => null }}
          />
          <Stack.Screen
            name="WebView"
            component={WebView}
            options={{ header: () => null }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default PagesRouter;
