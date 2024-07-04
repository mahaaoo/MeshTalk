import { useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";

import DefaultLineItem from "./defaultLineItem";
import { RefreshList, RefreshListRef } from "../../components";
import { useRefreshList } from "../../utils/hooks";
import StatusItem from "../statusItem";
import { Timelines, Response } from "../../config/interface";

interface TimeLineProps {
  index: number;
  currentIndex: number;
  fetchTimeLine: (params: object) => Response<Timelines[]>;
}

const TimeLine: React.FC<TimeLineProps> = (props) => {
  const { index, currentIndex, fetchTimeLine } = props;

  const { dataSource, onLoadMore, onRefresh, listStatus, fetchData } =
    useRefreshList(fetchTimeLine, "Normal", 20);
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
  }, [currentIndex, index, dataSource, fetchData]);

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
};

export default TimeLine;
