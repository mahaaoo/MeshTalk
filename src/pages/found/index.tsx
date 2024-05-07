import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RefreshList } from "../../components";
import { publicLine } from "../../server/timeline";
import { useLineList } from "../../utils/hooks";
import DefaultLineItem from "../home/defaultLineItem";
import HomeLineItem from "../home/timeLineItem";

interface PublicProps {
  tabLabel: string;
}

const Public: React.FC<PublicProps> = () => {
  const insets = useSafeAreaInsets();
  const { dataSource, fetchData, onLoadMore, onRefresh, listStatus } =
    useLineList(publicLine);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={[styles.main, { paddingTop: insets.top }]}>
      <RefreshList
        data={dataSource}
        renderItem={({ item }) => <HomeLineItem item={item} />}
        onHeaderRefresh={onRefresh}
        onFooterRefresh={onLoadMore}
        refreshState={listStatus}
        emptyComponent={
          <DefaultLineItem
            style={{ paddingTop: insets.top }}
            onRefresh={onRefresh}
            listStatus={listStatus}
          />
        }
        keyExtractor={(item, index) => item?.id || index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default Public;
