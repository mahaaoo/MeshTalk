import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Stack, useNavigationContainerRef } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  View,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ModalProvider, modalRef } from "react-native-ma-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "../config";
import useAppStore from "../store/useAppStore";
import useDeviceStore from "../store/useDeviceStore";
import useI18nStore from "../store/useI18nStore";
import usePreferenceStore from "../store/usePreferenceStore";

import { ResponsiveNavigator } from "../layout/navigator";
import { resopnseWidth } from "@utils/math";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

// const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
// // SENTRY_AUTH_TOKEN 已存入eas环境变量中
// // eas secret:list查看
Sentry.init({
  dsn: "https://ce3fd62d9888701f518d5e619bab9ae1@o4507417812992000.ingest.us.sentry.io/4507417816334336",
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
});

const App: React.FC<object> = () => {
  const { initApp, isReady } = useAppStore();
  const insets = useSafeAreaInsets();
  const { i18n } = useI18nStore();
  const { initPreference } = usePreferenceStore();
  const { width: originWidth } = useWindowDimensions();
  const { isColumnLayout } = useDeviceStore();

  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    initApp();
    // 初始化i18n等偏好设置
    initPreference();
    Dimensions.addEventListener("change", (event) => {
      if (!isColumnLayout) return;
      const width = resopnseWidth(event.window.width);
      useDeviceStore.setState({ width });
    });
  }, []);

  useEffect(() => {
    if (insets) {
      useDeviceStore.setState({
        insets,
      });
    }
    if (originWidth) {
      if (!isColumnLayout) return;
      const width = resopnseWidth(originWidth);
      useDeviceStore.setState({ width });
    }
  }, [insets, originWidth, isColumnLayout]);

  const renderChildren = () => {
    if (isColumnLayout) {
      return <ResponsiveNavigator />;
    }

    return (
      <Stack
        screenOptions={{
          headerBackTitle: i18n.t("header_back_title"),
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  };

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
          renderChildren()
        )}
      </ModalProvider>
    </GestureHandlerRootView>
  );
};

export default Sentry.wrap(App);
