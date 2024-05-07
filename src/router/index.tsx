import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import TabRoutes from "./tabRoutes";
import { routes, unLoginRoute, StackParams } from "../pages";
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
          {unLoginRoute.map((item, i) => {
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
      )}
    </Stack.Navigator>
  );
};

export default PagesRouter;
