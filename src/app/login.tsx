import { Stack, router } from "expo-router";
import React from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";

import { Button } from "../components";
import { Screen, Colors } from "../config";
import useLoginStore from "../store/useLoginStore";

const Login: React.FC<object> = () => {
  const { path, onPressLogin, onChangePath } = useLoginStore();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.main_view}>
        <View style={styles.go_back_view}>
          <Text style={styles.go_back_text} onPress={() => router.back()}>
            取消
          </Text>
        </View>
        <Text style={styles.login_title}>登录Mastodon</Text>
        <TextInput
          style={styles.input_style}
          placeholder="应用实例地址，例如：acg.mn"
          autoFocus
          onChangeText={onChangePath}
          value={path}
        />
        <Button
          text="登录"
          onPress={onPressLogin}
          style={styles.button_style}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  main_view: {
    flex: 1,
    alignItems: "center",
  },
  login_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 50,
  },
  input_style: {
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 50,
    alignItems: "flex-start",
  },
  button_style: {
    width: Screen.width - 80,
    marginVertical: 50,
  },
  go_back_view: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 20,
  },
  go_back_text: {
    fontSize: 16,
    color: Colors.buttonDefaultBackground,
  },
});

export default Login;
