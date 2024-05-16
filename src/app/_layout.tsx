import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalProvider, modalRef } from "react-native-ma-modal";

import useAppStore from "../store/useAppStore";

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
        <Stack screenOptions={{ headerBackTitle: "返回" }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
