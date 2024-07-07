import { RefreshList, Screen } from "@components";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";
import { useRefreshList } from "../../utils/hooks";

import { trendsLinks } from "../../server/timeline";
import WebCard from "@ui/statusItem/webCard";

interface LinkProps {}

const Link: React.FC<LinkProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh } = useRefreshList(
    trendsLinks,
    "Normal",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Screen headerShown title={i18n.t("explore_link_title")}>
      <View style={styles.main}>
        <RefreshList
          data={dataSource}
          renderItem={({ item }) => <WebCard card={item} key={item.url} />}
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

export default Link;
