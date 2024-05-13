import { Header } from "@react-navigation/elements";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";

import FavouriteItem from "./favouriteItem";
import FollowItem from "./followItem";
import MetionItem from "./metionItem";
import { RefreshList, Error } from "../../components";
import { Colors } from "../../config";
import { getRelationships } from "../../server/account";
import { getNotifications } from "../../server/notifications";
import { useRefreshList } from "../../utils/hooks";

interface AllNotifyProps {}

const AllNotify: React.FC<AllNotifyProps> = () => {
  const { dataSource, listStatus, onRefresh, onLoadMore, err } = useRefreshList(
    getNotifications,
    "Normal",
    40,
  );
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    onRefresh();
  }, []);

  const fetchRelationships = async () => {
    if (dataSource.length === 0) return;
    if (dataSource.length > 0 && dataSource.length <= 40) {
      // 一次请求回来的
      const ids = dataSource.map((item) => item.account.id);
      const { data, ok } = await getRelationships(ids);
      if (ok && data) {
        setRelationships(data);
      }
    } else {
      const ids = dataSource
        .slice(dataSource.length - relationships.length)
        .map((item) => item.account.id);
      const { data, ok } = await getRelationships(ids);
      if (ok && data) {
        setRelationships(relationships.concat(data));
      }
    }
  };

  useEffect(() => {
    if (dataSource.length > relationships.length) {
      fetchRelationships();
    }
  }, [dataSource, relationships]);

  if (err) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.defaultWhite,
          alignItems: "center",
        }}
      >
        <Header title="通知" />
        <View style={styles.line} />
        <Error type="NoNotify" style={{ marginTop: 200 }} />
        <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
          暂时没有通知
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="通知" />
      <View style={styles.line} />
      <View style={styles.main}>
        <RefreshList
          showsVerticalScrollIndicator={false}
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
          onHeaderRefresh={onRefresh}
          onFooterRefresh={onLoadMore}
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
});

export default AllNotify;
