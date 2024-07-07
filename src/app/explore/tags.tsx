import { RefreshList, Screen } from "@components";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";
import { useRefreshList } from "../../utils/hooks";

import { trendsTags } from "../../server/timeline";
import HashTagItem from "@ui/hashtag/HashTagItem";

interface TagsProps {}

const Tags: React.FC<TagsProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh } = useRefreshList(
    trendsTags,
    "Normal",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen headerShown title={i18n.t("explore_tag_title")}>
      <View style={styles.main}>
        <RefreshList
          data={dataSource}
          renderItem={({ item }) => <HashTagItem item={item} key={item.url} />}
          scrollEventThrottle={1}
          refreshState={listStatus}
          onRefresh={onRefresh}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
});

export default Tags;
