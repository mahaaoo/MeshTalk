import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import UserItem from "./userItem";
import { RefreshList, RefreshState } from "../../components";
import { Screen } from "../../config";
import { Account } from "../../config/interface";
import { getFollowingById } from "../../server/account";
import { useRequest } from "../../utils";
import { RouterProps } from "../index";

const fetchFollowingById = (id: string) => {
  const fn = (param: string) => {
    return getFollowingById(id, param);
  };
  return fn;
};

interface UserFollowProps extends RouterProps<"UserFollow"> {}

const UserFollow: React.FC<UserFollowProps> = (props) => {
  const { id } = props?.route?.params;
  const { data: followings, run: getFollowing } = useRequest(
    fetchFollowingById(id),
    { manual: false, loading: true },
  );

  const [dataSource, setDataSource] = useState<Account[]>([]);
  const [listStatus, setListStatus] = useState<RefreshState>(RefreshState.Idle);

  useEffect(() => {
    if (followings) {
      if (
        listStatus === RefreshState.HeaderRefreshing ||
        listStatus === RefreshState.Idle
      ) {
        setDataSource(followings);
      }
      if (listStatus === RefreshState.FooterRefreshing) {
        const maxId = dataSource[0]?.id;
        if (dataSource[0].id < maxId) {
          setDataSource((listData) => listData.concat(followings));
        }
      }
      setListStatus(RefreshState.Idle);
    }
  }, [followings]);

  const handleLoadMore = useCallback(() => {
    setListStatus(RefreshState.FooterRefreshing);
    const maxId = dataSource[dataSource.length - 1]?.id;
    getFollowing(`?max_id=${maxId}`);
  }, []);

  const handleRefresh = useCallback(() => {
    setListStatus(RefreshState.HeaderRefreshing);
    getFollowing();
  }, []);

  return (
    <View style={styles.main}>
      <RefreshList
        showsVerticalScrollIndicator={false}
        style={styles.refreshList}
        data={dataSource}
        renderItem={({ item }) => <UserItem item={item} />}
        onHeaderRefresh={handleRefresh}
        onFooterRefresh={handleLoadMore}
        scrollEventThrottle={1}
        refreshState={listStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshList: {
    flex: 1,
    width: Screen.width,
  },
});

export default UserFollow;
