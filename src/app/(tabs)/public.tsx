import { RefreshList, Screen } from "@components";
import DefaultLineItem from "@ui/home/defaultLineItem";
import StatusItem from "@ui/statusItem";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import { publicLine } from "../../server/timeline";
import useDeviceStore from "../../store/useDeviceStore";
import { useRefreshList } from "../../utils/hooks";

interface PublicProps {
  tabLabel: string;
}

const Public: React.FC<PublicProps> = () => {
  const { insets } = useDeviceStore();
  const { dataSource, fetchData, onLoadMore, onRefresh, listStatus } =
    useRefreshList(publicLine, "Normal", 20);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Screen headerShown={false}>
      <View style={[styles.main]}>
        <View style={{ backgroundColor: "#fff", height: insets.top }} />
        <RefreshList
          data={dataSource}
          renderItem={({ item }) => <StatusItem item={item} />}
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
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
});

export default Public;
