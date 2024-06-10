import { RefreshList, Screen } from "@components";
import UserItem from "@ui/fans/userItem";
import DefaultLineItem from "@ui/home/defaultLineItem";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../config";
import { mutes } from "../server/account";
import { useRefreshList } from "../utils/hooks";

interface MutesProps {}

const Mutes: React.FC<MutesProps> = (props) => {
  const { dataSource, listStatus, onRefresh, onLoadMore } = useRefreshList(
    mutes,
    "Link",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen headerShown title="屏蔽列表">
      <View style={styles.main}>
        <RefreshList
          data={dataSource}
          renderItem={({ item }) => <UserItem item={item} />}
          emptyComponent={
            <DefaultLineItem onRefresh={onRefresh} listStatus={listStatus} />
          }
          scrollEventThrottle={1}
          refreshState={listStatus}
          onRefresh={onRefresh}
          onFooterRefresh={onLoadMore}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.pageDefaultBackground,
    flex: 1,
  },
});

export default Mutes;
