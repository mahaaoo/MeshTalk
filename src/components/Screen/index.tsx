import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

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
      {children}
    </View>
  );
};

export default Screen;
