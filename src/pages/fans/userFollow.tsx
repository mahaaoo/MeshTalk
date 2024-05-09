import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import UserItem from "./userItem";
import { RefreshList } from "../../components";
import { getFollowingById } from "../../server/account";
import { useRefreshList } from "../../utils/hooks";
import { RouterProps } from "../index";

interface UserFollowProps extends RouterProps<"UserFollow"> {}

const UserFollow: React.FC<UserFollowProps> = (props) => {
  const { id } = props?.route?.params;
  const { dataSource, listStatus, onLoadMore, onRefresh, fetchData } =
    useRefreshList((params) => getFollowingById(id, params), "Link", 40);

  useEffect(() => {
    fetchData();
  }, []);

  return (
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
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default UserFollow;
