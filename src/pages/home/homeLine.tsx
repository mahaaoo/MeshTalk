import React, { useEffect } from "react";

import DefaultLineItem from "./defaultLineItem";
import HomeLineItem from "./timeLineItem";
import { RefreshList } from "../../components";
import useHomeStore from "../../store/useHomeStore";

interface HomeLineProps {
  index: number;
  currentIndex: number;
}

const HomeLine: React.FC<HomeLineProps> = (props) => {
  const { dataSource, onLoadMore, onRefresh, listStatus, fetchHomeData } =
    useHomeStore();
  const { index, currentIndex } = props;

  useEffect(() => {
    if (dataSource.length === 0 && index === currentIndex) {
      fetchHomeData();
    }
  }, [currentIndex, index]);

  return (
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
    />
  );
};

export default HomeLine;
