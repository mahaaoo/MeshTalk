import { RefreshList, Screen } from "@components";
import DefaultLineItem from "@ui/home/defaultLineItem";
import StatusItem from "@ui/statusItem";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../config";
import { bookmarks } from "../server/account";
import useI18nStore from "../store/useI18nStore";
import { useRefreshList } from "../utils/hooks";

interface FavouritiesProps {}

const Favourities: React.FC<FavouritiesProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh, onLoadMore } = useRefreshList(
    bookmarks,
    "Link",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  console.log(dataSource);

  return (
    <Screen headerShown title={i18n.t("page_title_bookmark")}>
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
