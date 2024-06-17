import { RefreshList, Screen, Error } from "@components";
import UserItem from "@ui/fans/userItem";
import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import { Colors } from "../config";
import { mutes, unmute } from "../server/account";
import useI18nStore from "../store/useI18nStore";
import { useRefreshList } from "../utils/hooks";

interface MutesProps {}

const Mutes: React.FC<MutesProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh, onLoadMore, err } = useRefreshList(
    mutes,
    "Link",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  const handleUnMute = async (id: string) => {
    const { data, ok } = await unmute(id);
    if (data && ok) {
      console.log("取消屏蔽成功");
    }
  };

  return (
    <Screen headerShown title={i18n.t("page_title_mute")}>
      {err ? (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.defaultWhite,
            alignItems: "center",
          }}
        >
          <Error type="NoData" style={{ marginTop: 200 }} />
          <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
            {i18n.t("page_mute_null")}
          </Text>
        </View>
      ) : (
        <View style={styles.main}>
          <RefreshList
            data={dataSource}
            renderItem={({ item }) => (
              <UserItem
                item={item}
                showButton
                buttonOption={{
                  onPress: () => handleUnMute(item.id),
                  title: "取消屏蔽",
                }}
              />
            )}
            scrollEventThrottle={1}
            refreshState={listStatus}
            onRefresh={onRefresh}
            onFooterRefresh={onLoadMore}
          />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.pageDefaultBackground,
    flex: 1,
  },
});

export default Mutes;
