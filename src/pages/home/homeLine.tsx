import React, { useEffect } from "react";

import DefaultLineItem from "./defaultLineItem";
import HomeLineItem from "./timeLineItem";
import { RefreshList } from "../../components";
import { homeLine } from "../../server/timeline";
import { useLineList } from "../../utils/hooks";

interface HomeLineProps {
  index: number;
  currentIndex: number;
}

const HomeLine: React.FC<HomeLineProps> = (props) => {
  const { dataSource, onLoadMore, onRefresh, listStatus, fetchData } =
    useLineList(homeLine);
  const { index, currentIndex } = props;

  useEffect(() => {
    if (dataSource.length === 0 && index === currentIndex) {
      fetchData();
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
