import { RefreshList, Screen } from "@components";
import DefaultLineItem from "@ui/home/defaultLineItem";
import StatusItem from "@ui/statusItem";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../config";
import { getFavouritesById } from "../server/account";
import { useRefreshList } from "../utils/hooks";

interface FavouritiesProps {}

const Favourities: React.FC<FavouritiesProps> = (props) => {
  const { dataSource, listStatus, onRefresh, onLoadMore } = useRefreshList(
    getFavouritesById,
    "Link",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen headerShown title="喜欢的内容">
      <View style={styles.main}>
        <RefreshList
          data={dataSource}
          renderItem={({ item }) => <StatusItem item={item} />}
          emptyComponent={
            <DefaultLineItem onRefresh={onRefresh} listStatus={listStatus} />
          }
          scrollEventThrottle={1}
          refreshState={listStatus}
          onRefresh={onRefresh}
          onFooterRefresh={onLoadMore}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.pageDefaultBackground,
    flex: 1,
  },
});

export default Favourities;
