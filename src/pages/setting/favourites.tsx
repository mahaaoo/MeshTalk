import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { RefreshList } from "../../components";
import { Colors } from "../../config";
import { getFavouritesById } from "../../server/account";
import { useRefreshList } from "../../utils/hooks";
import DefaultLineItem from "../home/defaultLineItem";
import HomeLineItem from "../home/timeLineItem";
import { RouterProps } from "../index";

interface FavouritiesProps extends RouterProps<"Favourites"> {}

const Favourities: React.FC<FavouritiesProps> = (props) => {
  const { dataSource, listStatus, onRefresh, onLoadMore } = useRefreshList(
    getFavouritesById,
    "Link",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <View style={styles.main}>
      <RefreshList
        data={dataSource}
        renderItem={({ item }) => <HomeLineItem item={item} />}
        emptyComponent={
          <DefaultLineItem onRefresh={onRefresh} listStatus={listStatus} />
        }
        scrollEventThrottle={1}
        refreshState={listStatus}
        onRefresh={onRefresh}
        onFooterRefresh={onLoadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.pageDefaultBackground,
    flex: 1,
  },
});

export default Favourities;
