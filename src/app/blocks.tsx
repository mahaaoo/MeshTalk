import { RefreshList, Screen, Error } from "@components";
import UserItem from "@ui/fans/userItem";
import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import { Colors } from "../config";
import { blocks, unblock } from "../server/account";
import useI18nStore from "../store/useI18nStore";
import { useRefreshList } from "../utils/hooks";

interface BlocksProps {}

const Blocks: React.FC<BlocksProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh, onLoadMore, err } = useRefreshList(
    blocks,
    "Link",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  const handleUnblock = async (id: string) => {
    const { data, ok } = await unblock(id);
    if (data && ok) {
      console.log("取消拉黑成功");
    }
  };

  return (
    <Screen headerShown title={i18n.t("page_title_block")}>
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
            {i18n.t("page_block_null")}
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
                  onPress: () => handleUnblock(item.id),
                  title: "取消拉黑",
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

export default Blocks;
