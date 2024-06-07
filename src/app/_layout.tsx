import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalProvider, modalRef } from "react-native-ma-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useAppStore from "../store/useAppStore";
import useDeviceStore from "../store/useDeviceStore";

const App: React.FC<object> = () => {
  const { initApp, isReady } = useAppStore();
  const { setInset } = useDeviceStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    initApp();
    setInset(insets);
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalProvider ref={modalRef}>
        <Stack
          screenOptions={{
            headerBackTitle: "返回",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ModalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
