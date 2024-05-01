import React, { useRef, useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";

import { RefreshList, RefreshState } from "../../components";
import { Colors, Screen } from "../../config";
import { Timelines } from "../../config/interface";
import { getFavouritesById } from "../../server/account";
import { useRequest } from "../../utils";
import DefaultLineItem from "../home/defaultLineItem";
import HomeLineItem from "../home/homelineItem";

const fetchStatusById = () => {
  const fn = (param: string) => {
    return getFavouritesById(param);
  };
  return fn;
};

interface FavouritiesProps {}

const Favourities: React.FC<FavouritiesProps> = (props) => {
  const {} = props;

  const { data: favourities, run: getFavourities } = useRequest(
    fetchStatusById(),
    { loading: false, manual: true },
  ); // 获取用户发表过的推文
  const [dataSource, setDataSource] = useState<Timelines[]>(new Array(6));
  const [listStatus, setListStatus] = useState<RefreshState>(RefreshState.Idle); // 内嵌的FlatList的当前状态
  const table: any = useRef(null);

  useEffect(() => {
    getFavourities();
  }, []);

  useEffect(() => {
    // 每当请求了新数据，都将下拉刷新状态设置为false
    if (favourities) {
      if (listStatus === RefreshState.Idle) {
        setDataSource(favourities);
      }
      if (listStatus === RefreshState.FooterRefreshing) {
        const maxId = dataSource[0]?.id;
        if (dataSource[0].id < maxId) {
          setDataSource((listData) => listData.concat(favourities));
        }

        setListStatus(RefreshState.Idle);
      }
    }
  }, [favourities]);

  const handleLoadMore = useCallback(() => {
    setListStatus(RefreshState.FooterRefreshing);
    const maxId = dataSource[dataSource.length - 1]?.id;
    getFavourities(`?max_id=${maxId}`);
  }, []);

  return (
    <View style={styles.main}>
      <RefreshList
        bounces={false}
        ref={table}
        showsVerticalScrollIndicator={false}
        style={{ width: Screen.width }}
        data={dataSource}
        renderItem={({ item }) => {
          if (dataSource.length === 6) {
            return <DefaultLineItem />;
          }
          return <HomeLineItem item={item} />;
        }}
        scrollEventThrottle={1}
        refreshState={listStatus}
        onFooterRefresh={handleLoadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.pageDefaultBackground,
    flex: 1,
  },
});

export default Favourities;
