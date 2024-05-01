import { Header } from "@react-navigation/elements";
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import DefaultLineItem from "./defaultLineItem";
import HomeLineItem from "./homelineItem";
import { RefreshList, RefreshState } from "../../components";
import { Colors, Screen } from "../../config";
import { Timelines } from "../../config/interface";
import { verifyToken } from "../../server/app";
import { homeLine } from "../../server/timeline";
import { useAppStore, useAccountStore } from "../../store";
import { navigate, useRequest } from "../../utils";

const fetchHomeLine = () => {
  const fn = (params: string) => {
    return homeLine(params);
  };
  return fn;
};

const Home: React.FC<object> = () => {
  const appStore = useAppStore();
  const accountStore = useAccountStore();

  const [listData, setListData] = useState<Timelines[]>([]);
  const [status, setStatus] = useState<RefreshState>(RefreshState.Idle);

  const { data: homeLineData, run: getHomeLineData } = useRequest(
    fetchHomeLine(),
    { manual: true, loading: false },
  );
  const { data: account, run: fetchVerifyToken } = useRequest(verifyToken, {
    manual: true,
    loading: false,
  });

  const handleRefresh = useCallback(() => {
    setStatus(RefreshState.HeaderRefreshing);
    getHomeLineData();
  }, [status]);

  const handleLoadMore = useCallback(() => {
    setStatus(RefreshState.FooterRefreshing);
    const maxId = listData[listData.length - 1].id;
    getHomeLineData(`?max_id=${maxId}`);
  }, [status, listData]);

  useEffect(() => {
    if (
      appStore?.hostURL &&
      appStore?.token &&
      appStore?.hostURL?.length > 0 &&
      appStore?.token?.length > 0
    ) {
      fetchVerifyToken();
    } else {
      navigate("Guide");
    }
  }, [appStore.hostURL, appStore.token]);

  useEffect(() => {
    if (account) {
      getHomeLineData();
      accountStore.setCurrentAccount(account);
    }
  }, [account]);

  useEffect(() => {
    if (homeLineData) {
      if (
        status === RefreshState.HeaderRefreshing ||
        status === RefreshState.Idle
      ) {
        setListData(homeLineData);
      }
      if (status === RefreshState.FooterRefreshing) {
        setListData(listData.concat(homeLineData));
      }
      setStatus(RefreshState.Idle);
    }
  }, [homeLineData]);

  return (
    <View style={styles.container}>
      <Header title="首页" />
      <View style={styles.line} />
      <View style={styles.main}>
        <RefreshList
          data={listData}
          renderItem={({ item }) => <HomeLineItem item={item} />}
          onHeaderRefresh={handleRefresh}
          onFooterRefresh={handleLoadMore}
          refreshState={status}
          emptyComponent={<DefaultLineItem />}
          keyExtractor={(item, index) => item?.id || index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
    width: Screen.width,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
