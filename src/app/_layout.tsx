import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Stack, useNavigationContainerRef } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalProvider, modalRef } from "react-native-ma-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "../config";
import useAppStore from "../store/useAppStore";
import useDeviceStore from "../store/useDeviceStore";
import useI18nStore from "../store/useI18nStore";

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
// SENTRY_AUTH_TOKEN 已存入eas环境变量中
// eas secret:list查看
Sentry.init({
  dsn: "https://ce3fd62d9888701f518d5e619bab9ae1@o4507417812992000.ingest.us.sentry.io/4507417816334336",
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
      // ...
    }),
  ],
});

const App: React.FC<object> = () => {
  const { initApp, isReady } = useAppStore();
  const insets = useSafeAreaInsets();
  const { initI18n } = useI18nStore();

  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    initApp();
    // 初始化i18n
    initI18n();
  }, []);

  useEffect(() => {
    useDeviceStore.setState({
      insets,
    });
  }, [insets]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalProvider ref={modalRef}>
        {!isReady ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <ActivityIndicator animating color={Colors.theme} />
          </View>
        ) : (
          <Stack
            screenOptions={{
              headerBackTitle: "返回",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        )}
      </ModalProvider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
