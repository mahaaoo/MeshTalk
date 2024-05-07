import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalProvider, modalRef } from "react-native-ma-modal";

import Router from "./src/router";
import useAppStore from "./src/store/useAppStore";
import { navigationRef } from "./src/utils/rootNavigation";

const App: React.FC<object> = () => {
  const { initApp, isReady } = useAppStore();

  useEffect(() => {
    initApp();
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalProvider ref={modalRef}>
        <NavigationContainer ref={navigationRef}>
          <Router />
        </NavigationContainer>
      </ModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
