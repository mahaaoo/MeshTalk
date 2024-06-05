import { useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";

import DefaultLineItem from "./defaultLineItem";
import { RefreshList, RefreshListRef } from "../../components";
import { homeLine } from "../../server/timeline";
import { useRefreshList } from "../../utils/hooks";
import StatusItem from "../statusItem";

interface HomeLineProps {
  index: number;
  currentIndex: number;
}

const HomeLine: React.FC<HomeLineProps> = (props) => {
  const { dataSource, onLoadMore, onRefresh, listStatus, fetchData } =
    useRefreshList(homeLine, "Normal", 20);
  const { index, currentIndex } = props;
  const navigation = useNavigation();
  const ref = useRef<RefreshListRef>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener<any>("tabPress", () => {
      if (navigation.isFocused() && currentIndex === index) {
        if (ref.current && ref.current?.offset() > 0) {
          console.log("zhx");
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
  }, [currentIndex, index]);

  return (
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
    />
  );
};

export default HomeLine;
