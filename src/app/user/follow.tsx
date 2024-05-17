import { RefreshList, Screen } from "@components";
import UserItem from "@ui/fans/userItem";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { getFollowingById } from "../../server/account";
import { useRefreshList } from "../../utils/hooks";

interface UserFollowProps {}

const UserFollow: React.FC<UserFollowProps> = (props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dataSource, listStatus, onLoadMore, onRefresh } = useRefreshList(
    (params) => getFollowingById(id, params),
    "Link",
    40,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen headerShown title="关注">
      <View style={styles.main}>
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default UserFollow;
