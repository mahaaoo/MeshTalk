import { RefreshList, Screen, Error } from "@components";
import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import { Colors } from "../config";
import { followedTags } from "../server/account";
import useI18nStore from "../store/useI18nStore";
import { useRefreshList } from "../utils/hooks";
import HashTagItem from "@ui/hashtag/HashTagItem";

interface HashtagsProps {}

const Hashtags: React.FC<HashtagsProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh, onLoadMore, err } = useRefreshList(
    followedTags,
    "Link",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen headerShown title={i18n.t("page_title_hashtag")}>
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
            {i18n.t("page_hashtag_null")}
          </Text>
        </View>
      ) : (
        <View style={styles.main}>
          <RefreshList
            data={dataSource}
            renderItem={({ item }) => (
              <HashTagItem item={item} key={item.url} />
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

export default Hashtags;
