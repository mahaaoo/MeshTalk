import { Button, Screen } from "@components";
import ServerCard from "@ui/welcome/serverCard";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  ScrollView,
} from "react-native";

import { Colors } from "../../config";
import { MastodonServers } from "../../config/interface";
import { getMastodonServers } from "../../server/app";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";

const Guide: React.FC<object> = () => {
  const [recommend, setRecommend] = useState<MastodonServers[]>([]);
  const { i18n, local } = useI18nStore();
  const { width } = useDeviceStore();

  useEffect(() => {
    const fetch = async (local: string) => {
      // TODO:获取本地的语言类型，默认en
      const { data, ok } = await getMastodonServers({
        language: local,
      });

      if (ok && data && data?.length > 0) {
        setRecommend(data);
      }
    };
    fetch(local?.locale!);
  }, [local]);

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.guide_main}>
          <Text style={styles.guide_title}>{i18n.t("page_welcome_text")}</Text>
          <View style={{ height: 450, marginVertical: 25 }}>
            {recommend.length > 0 ? (
              <FlatList
                data={recommend}
                showsHorizontalScrollIndicator={false}
                horizontal
                renderItem={({ item }) => {
                  return <ServerCard server={item} />;
                }}
              />
            ) : null}
          </View>
          <Button
            text={i18n.t("page_welcome_more")}
            style={{ marginTop: 10, width: width - 50, marginLeft: 25 }}
            onPress={() => {
              router.push("/welcome/moreServers");
            }}
          />
          <View style={styles.login_view}>
            <Text style={styles.login_title}>
              {i18n.t("page_has_account")}
              <Text
                style={styles.login_text}
                onPress={() => {
                  router.push("/login");
                }}
              >
                {i18n.t("page_account_login")}
              </Text>
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  guide_main: {
    flex: 1,
  },
  guide_title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 50,
    textAlign: "center",
  },
  login_view: {
    position: "absolute",
    left: 25,
    bottom: useDeviceStore.getState().insets.bottom + 20,
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
