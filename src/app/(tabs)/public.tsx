import { RefreshList, Screen, RefreshListRef } from "@components";
import DefaultLineItem from "@ui/home/defaultLineItem";
import StatusItem from "@ui/statusItem";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef } from "react";
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

  const navigation = useNavigation();
  const ref = useRef<RefreshListRef>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener<any>("tabPress", () => {
      if (ref.current && ref.current?.offset() > 0) {
        ref.current && ref.current?.srollToTop();
      } else {
        // onRefresh();
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Screen headerShown={false}>
      <View style={[styles.main]}>
        <View style={{ backgroundColor: "#fff", height: insets.top }} />
        <RefreshList
          ref={ref}
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
