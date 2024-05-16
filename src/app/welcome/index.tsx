import { router, Stack } from "expo-router";
import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";

import { Colors } from "../../config";

import { Button } from "@/components";

const showLoading = () => {
  router.push("/Recommand");
};

const Guide: React.FC<object> = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.guide_main}>
        <Text style={styles.guide_title}>欢迎来到Mastodon!</Text>
        <Button text="寻找感兴趣的社区" onPress={showLoading} />
        <View style={styles.login_view}>
          <Text style={styles.login_title}>
            已有账号？
            <Text
              style={styles.login_text}
              onPress={() => {
                router.push("/login");
              }}
            >
              登录
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  guide_main: {
    flex: 1,
    alignItems: "center",
  },
  guide_title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 50,
  },
  login_view: {
    position: "absolute",
    left: 25,
    bottom: 85,
  },
  login_title: {
    color: Colors.grayTextColor,
    fontSize: 16,
  },
  login_text: {
    color: Colors.buttonDefaultBackground,
  },
});

export default Guide;
