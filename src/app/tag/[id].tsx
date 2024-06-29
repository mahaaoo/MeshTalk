import { Button, RefreshList, Screen } from "@components";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import {
  tagTimelines,
  tagInfo,
  followTag,
  unfollowTag,
} from "../../server/account";
import { useRefreshList } from "@utils/hooks";
import StatusItem from "@ui/statusItem";
import DefaultLineItem from "@ui/home/defaultLineItem";
import useI18nStore from "../../store/useI18nStore";

const Users: React.FC<object> = () => {
  const { id = "" } = useLocalSearchParams<{
    id: string;
  }>();

  const { i18n } = useI18nStore();
  const navigation = useNavigation();
  const [follow, setFollow] = useState(false);
  const { dataSource, listStatus, onLoadMore, onRefresh, err, fetchData } =
    useRefreshList((params) => tagTimelines(id, params), "Normal", 20);

  const handleFollow = useCallback(async () => {
    if (follow) {
      const { data, ok } = await unfollowTag(id);
      if (data && ok) {
        setFollow(data.following);
      }
    } else {
      const { data, ok } = await followTag(id);
      if (data && ok) {
        setFollow(data.following);
      }
    }
  }, [follow, id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          style={{ height: 35, borderRadius: 20, paddingVertical: 0 }}
          textStyle={{ fontSize: 15 }}
          text={
            follow
              ? i18n.t("hash_info_following_text")
              : i18n.t("hash_info_follow_text")
          }
          onPress={handleFollow}
        />
      ),
    });
  }, [follow, handleFollow, i18n, navigation]);

  useEffect(() => {
    const fetchInfo = async (id: string) => {
      const { data, ok } = await tagInfo(id);
      if (data && ok) {
        setFollow(data.following);
      }
    };

    fetchData();
    fetchInfo(id);
  }, [fetchData, id]);

  return (
    <Screen headerShown title={id}>
      <View style={[styles.main]}>
        <RefreshList
          data={dataSource}
          renderItem={({ item }) => <StatusItem item={item} />}
          onHeaderRefresh={onRefresh}
          onFooterRefresh={onLoadMore}
          refreshState={listStatus}
          emptyComponent={
            <DefaultLineItem onRefresh={onRefresh} listStatus={listStatus} />
          }
          keyExtractor={(item, index) => item?.id || index.toString()}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Users;
