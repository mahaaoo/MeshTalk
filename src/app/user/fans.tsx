import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { RefreshList } from "../../components";
import { Colors } from "../../config";
import { getFollowersById } from "../../server/account";
import { useRefreshList } from "../../utils/hooks";

import UserItem from "@/ui/fans/userItem";

interface UserFansProps {}

const UserFans: React.FC<UserFansProps> = (props) => {
  const { id } = useLocalSearchParams();
  const { dataSource, listStatus, onLoadMore, onRefresh } = useRefreshList(
    (params) => getFollowersById(id, params),
    "Link",
    40,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <View style={styles.main}>
      <Stack.Screen options={{ title: "粉丝" }} />
      <RefreshList
        showsVerticalScrollIndicator={false}
        data={dataSource}
        renderItem={({ item }) => <UserItem item={item} />}
        onHeaderRefresh={onRefresh}
        onFooterRefresh={onLoadMore}
        scrollEventThrottle={16}
        refreshState={listStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
});

export default UserFans;
