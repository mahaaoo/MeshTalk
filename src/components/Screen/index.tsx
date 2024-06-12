import { ErrorBoundary, Error } from "@components";
import { Stack, router } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

import { Colors } from "../../config";

interface ScreenProps {
  headerShown?: boolean;
  title?: string;
  children: React.ReactNode;
}

const Screen: React.FC<ScreenProps> = (props) => {
  const { headerShown = false, children, title } = props;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown, title }} />
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
              出错了,刷新试试
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
