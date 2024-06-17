import { Icon, Screen } from "@components";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";

import { Colors } from "../../config";
import { MastodonServers } from "../../config/interface";
import { getMastodonServers } from "../../server/app";
import useI18nStore from "../../store/useI18nStore";

interface MoreServersProps {}

const MoreServers: React.FC<MoreServersProps> = (props) => {
  const [recommend, setRecommend] = useState<MastodonServers[]>([]);
  const { i18n } = useI18nStore();

  useEffect(() => {
    const fetch = async () => {
      // TODO:获取本地的语言类型，默认en
      const { data, ok } = await getMastodonServers();

      if (ok && data && data?.length > 0) {
        setRecommend(data);
      }
    };
    fetch();
  }, []);

  return (
    <Screen headerShown title={i18n.t("page_server_title")}>
      <FlatList
        data={recommend}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/welcome/serverDetail",
                  params: {
                    server: JSON.stringify(item),
                  },
                });
              }}
              style={{
                flexDirection: "row",
                backgroundColor: "#fff",
                paddingHorizontal: 15,
                paddingVertical: 5,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Image
                  source={{
                    uri: item.proxied_thumbnail,
                  }}
                  style={{ width: 80, height: 80, borderRadius: 5 }}
                />
                <View
                  style={{
                    flex: 1,
                    paddingHorizontal: 5,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {item.domain}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{ marginTop: 10, color: Colors.grayTextColor }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
              <Icon name="arrowRight" color={Colors.grayTextColor} />
            </TouchableOpacity>
          );
        }}
      />
    </Screen>
  );
};

export default MoreServers;
