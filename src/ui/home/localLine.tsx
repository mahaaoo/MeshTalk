import { useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";

import DefaultLineItem from "./defaultLineItem";
import { RefreshList, RefreshListRef } from "../../components";
import { Colors } from "../../config";
import { localLine } from "../../server/timeline";
import { useRefreshList } from "../../utils/hooks";
import StatusItem from "../statusItem";

interface LocalProps {
  index: number;
  currentIndex: number;
}

const Local: React.FC<LocalProps> = (props) => {
  const { dataSource, onLoadMore, onRefresh, listStatus, fetchData } =
    useRefreshList(localLine, "Normal", 20);

  const { index, currentIndex } = props;

  const navigation = useNavigation();
  const ref = useRef<RefreshListRef>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener<any>("tabPress", () => {
      if (navigation.isFocused() && currentIndex === index) {
        if (ref.current && ref.current?.offset() > 0) {
          ref.current && ref.current?.srollToTop();
        } else {
          // onRefresh();
        }
      }
    });

    return unsubscribe;
  }, [navigation, currentIndex, index, ref]);

  useEffect(() => {
    if (dataSource.length === 0 && index === currentIndex) {
      fetchData();
    }
  }, [currentIndex, dataSource, fetchData, index]);

  return (
    <View style={styles.main}>
      <RefreshList
        ref={ref}
        data={dataSource}
        renderItem={({ item }) => <StatusItem item={item} />}
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
