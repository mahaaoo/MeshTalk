import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { getFollowingById } from "../../server/account";
import { useRefreshList } from "../../utils/hooks";

import { RefreshList } from "@/components";
import UserItem from "@/ui/fans/userItem";

interface UserFollowProps {}

const UserFollow: React.FC<UserFollowProps> = (props) => {
  const { id } = useLocalSearchParams();
  const { dataSource, listStatus, onLoadMore, onRefresh } = useRefreshList(
    (params) => getFollowingById(id, params),
    "Link",
    40,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <View style={styles.main}>
      <Stack.Screen options={{ title: "关注" }} />
      <RefreshList
        showsVerticalScrollIndicator={false}
        data={dataSource}
        renderItem={({ item }) => <UserItem item={item} />}
        onHeaderRefresh={onRefresh}
        onFooterRefresh={onLoadMore}
        scrollEventThrottle={1}
        refreshState={listStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default UserFollow;
