import { Button, Screen } from "@components";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, TextInput, StyleSheet, SafeAreaView } from "react-native";

import { Colors } from "../config";
import useDeviceStore from "../store/useDeviceStore";
import useI18nStore from "../store/useI18nStore";
import useLoginStore from "../store/useLoginStore";

const Login: React.FC<object> = () => {
  const { domain = "" } = useLocalSearchParams<{ domain: string }>();
  const { path, onPressLogin, onChangePath } = useLoginStore();
  const { i18n } = useI18nStore();

  useEffect(() => {
    if (domain.length > 0) {
      onChangePath(domain);
    }
  }, [domain]);

  return (
    <Screen>
      <SafeAreaView style={styles.main_view}>
        <View style={styles.go_back_view}>
          <Text style={styles.go_back_text} onPress={() => router.back()}>
            {i18n.t("page_login_cancel")}
          </Text>
        </View>
        <Text style={styles.login_title}>{i18n.t("page_login_title")}</Text>
        <TextInput
          style={styles.input_style}
          placeholder={i18n.t("page_login_server_placeholder")}
          autoFocus
          onChangeText={onChangePath}
          value={path}
          underlineColorAndroid="transparent"
        />
        <Button
          text={i18n.t("page_login_text")}
          onPress={onPressLogin}
          style={styles.button_style}
        />
      </SafeAreaView>
    </Screen>
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
    width: useDeviceStore.getState().width - 80,
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
