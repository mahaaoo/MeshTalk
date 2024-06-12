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

const Guide: React.FC<object> = () => {
  const [recommend, setRecommend] = useState<MastodonServers[]>([]);
  const { width } = useDeviceStore();

  useEffect(() => {
    const fetch = async () => {
      // TODO:获取本地的语言类型，默认en
      const { data, ok } = await getMastodonServers({
        language: "zh",
      });

      if (ok && data && data?.length > 0) {
        setRecommend(data);
      }
    };
    fetch();
  }, []);

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.guide_main}>
          <Text style={styles.guide_title}>欢迎来到MeshTalk</Text>
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
            text="寻找更多的实例"
            style={{ marginTop: 10, width: width - 50, marginLeft: 25 }}
            onPress={() => {
              router.push("/welcome/moreServers");
            }}
          />
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
