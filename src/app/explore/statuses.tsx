import { RefreshList, Screen } from "@components";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";
import { useRefreshList } from "../../utils/hooks";

import { trendsStatuses } from "../../server/timeline";
import StatusItem from "@ui/statusItem";
import DefaultLineItem from "@ui/home/defaultLineItem";

interface StatusesProps {}

const Statuses: React.FC<StatusesProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh } = useRefreshList(
    trendsStatuses,
    "Normal",
    40,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen headerShown title={i18n.t("explore_status_title")}>
      <View style={styles.main}>
        <RefreshList
          data={dataSource}
          renderItem={({ item }) => (
            <StatusItem item={item} key={item.id} needDivide={false} />
          )}
          emptyComponent={
            <DefaultLineItem onRefresh={onRefresh} listStatus={listStatus} />
          }
          scrollEventThrottle={1}
          refreshState={listStatus}
          onRefresh={onRefresh}
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

export default Statuses;
