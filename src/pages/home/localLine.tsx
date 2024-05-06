import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import DefaultLineItem from "./defaultLineItem";
import HomeLineItem from "./timeLineItem";
import { RefreshList } from "../../components";
import { Colors } from "../../config";
import useLocalStore from "../../store/useLocalStore";

interface LocalProps {
  index: number;
  currentIndex: number;
}

const Local: React.FC<LocalProps> = (props) => {
  const { dataSource, onLoadMore, onRefresh, listStatus, fetchLocalData } =
    useLocalStore();
  const { index, currentIndex } = props;

  useEffect(() => {
    if (dataSource.length === 0 && index === currentIndex) {
      fetchLocalData();
    }
  }, [currentIndex, index]);

  return (
    <View style={styles.main}>
      <RefreshList
        data={dataSource}
        renderItem={({ item }) => <HomeLineItem item={item} />}
        onHeaderRefresh={onRefresh}
        onFooterRefresh={onLoadMore}
        refreshState={listStatus}
        emptyComponent={
          <DefaultLineItem onRefresh={onRefresh} listStatus={listStatus} />
        }
        keyExtractor={(item, index) => item?.id || index.toString()}
        {...props}
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

export default Local;
