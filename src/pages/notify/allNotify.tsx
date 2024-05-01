import { Header } from "@react-navigation/elements";
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import FavouriteItem from "./favouriteItem";
import FollowItem from "./followItem";
import MetionItem from "./metionItem";
import { RefreshList, RefreshState } from "../../components";
import { Colors, Screen } from "../../config";
import { Notification } from "../../config/interface";
import { getRelationships } from "../../server/account";
import { getNotifications } from "../../server/notifications";
import { useRequest } from "../../utils/hooks";

const fetchNotifications = () => {
  const fn = (param: string) => {
    return getNotifications(param);
  };
  return fn;
};

const fetchRelationships = () => {
  const fn = (id: string[]) => {
    return getRelationships(id);
  };
  return fn;
};

interface AllNotifyProps {}

const AllNotify: React.FC<AllNotifyProps> = () => {
  const { data: notifications, run: getNotifications } = useRequest(
    fetchNotifications(),
    { loading: false, manual: true },
  ); // 获取用户发表过的推文
  const { data: relationships, run: getRelationship } = useRequest(
    fetchRelationships(),
    { manual: true, loading: false },
  ); // 获取用户的个人信息

  const [dataSource, setDataSource] = useState<Notification[]>([]);
  const [listStatus, setListStatus] = useState<RefreshState>(RefreshState.Idle);

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    // 每当请求了新数据，都将下拉刷新状态设置为false
    if (notifications) {
      // 获取所有关注你的人，与你的relationship
      const followIds = notifications.map((item) => item.account?.id);
      if (followIds.length > 0) {
        getRelationship(followIds);
      }

      if (
        listStatus === RefreshState.HeaderRefreshing ||
        listStatus === RefreshState.Idle
      ) {
        setDataSource(notifications);
      }
      if (listStatus === RefreshState.FooterRefreshing) {
        const maxId = dataSource[0]?.id;
        if (dataSource[0].id < maxId) {
          setDataSource((listData) => listData.concat(notifications));
        }
      }
      setListStatus(RefreshState.Idle);
    }
  }, [notifications]);

  const handleLoadMore = useCallback(() => {
    setListStatus(RefreshState.FooterRefreshing);
    const maxId = dataSource[dataSource.length - 1]?.id;
    getNotifications(`?max_id=${maxId}`);
  }, []);

  const handleRefresh = useCallback(() => {
    setListStatus(RefreshState.HeaderRefreshing);
    getNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="通知" />
      <View style={styles.line} />
      <View style={styles.main}>
        <RefreshList
          showsVerticalScrollIndicator={false}
          style={styles.refreshList}
          data={dataSource}
          renderItem={({ item }) => {
            if (item?.type === "follow") {
              return <FollowItem item={item} relationships={relationships} />;
            }
            if (item?.type === "favourite") {
              return <FavouriteItem item={item} />;
            }
            if (item?.type === "mention") {
              return <MetionItem item={item} />;
            }
            return <View />;
          }}
          onHeaderRefresh={handleRefresh}
          onFooterRefresh={handleLoadMore}
          scrollEventThrottle={1}
          refreshState={listStatus}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
  },
  main: {
    backgroundColor: Colors.pageDefaultBackground,
    flex: 1,
  },
  refreshList: {
    flex: 1,
    width: Screen.width,
  },
});

export default AllNotify;
