import { Stack, router } from "expo-router";
import { Header } from "@react-navigation/elements";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";
import Error from "../Error";
import { ErrorBoundary } from "../ErrorBoundary";
import { Icon } from "../Icon";
import useDeviceStore from "../../store/useDeviceStore";

interface ScreenProps {
  headerShown?: boolean;
  title?: string;
  children: React.ReactNode;
}

const Screen: React.FC<ScreenProps> = (props) => {
  const { headerShown = false, children, title } = props;
  const { i18n } = useI18nStore();
  const { isColumnLayout } = useDeviceStore();

  const renderHeader = () => {
    if (isColumnLayout) {
      return (
        <>
          <Stack.Screen options={{ headerShown: false }} />
          {headerShown && (
            <Header
              headerLeft={() => (
                <TouchableOpacity onPress={() => router.back()}>
                  <Icon name="arrowLeft" color="#2593FC" />
                </TouchableOpacity>
              )}
              title={title || ""}
              headerTintColor="#2593FC"
            />
          )}
        </>
      );
    }
    return <Stack.Screen options={{ headerShown, title }} />;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <ErrorBoundary
        onError={(error, info) => {
          console.log("ErrorBoundary Catch Error", error, info);
        }}
        FallbackComponent={() => (
          <View
            style={{
              flex: 1,
              backgroundColor: Colors.defaultWhite,
              alignItems: "center",
            }}
          >
            <Error type="NoResult" style={{ marginTop: 200 }} />
            <Text
              onPress={() => router.replace("/")}
              style={{ fontSize: 16, color: Colors.grayTextColor }}
            >
              {i18n.t("screen_load_error_text")}
            </Text>
          </View>
        )}
      >
        {children}
      </ErrorBoundary>
    </View>
  );
};

export default Screen;
