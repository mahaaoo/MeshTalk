import React, { useEffect } from "react";

import DefaultLineItem from "./defaultLineItem";
import StatusItem from "../statusItem";
import { RefreshList } from "../../components";
import { homeLine } from "../../server/timeline";
import { useRefreshList } from "../../utils/hooks";

interface HomeLineProps {
  index: number;
  currentIndex: number;
}

const HomeLine: React.FC<HomeLineProps> = (props) => {
  const { dataSource, onLoadMore, onRefresh, listStatus, fetchData } =
    useRefreshList(homeLine, "Normal", 20);
  const { index, currentIndex } = props;

  useEffect(() => {
    if (dataSource.length === 0 && index === currentIndex) {
      fetchData();
    }
  }, [currentIndex, index]);

  return (
    <RefreshList
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
