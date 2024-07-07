import { RefreshList, Screen } from "@components";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";
import { useRefreshList, useRelationships } from "../../utils/hooks";

import { suggestions } from "../../server/timeline";
import UserItem from "@ui/fans/userItem";

interface SuggestionProps {}

const Suggestion: React.FC<SuggestionProps> = (props) => {
  const { i18n } = useI18nStore();
  const { dataSource, listStatus, onRefresh } = useRefreshList(
    suggestions,
    "Normal",
    80,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  const { mergeDataSource } = useRelationships(
    dataSource.map((data) => data.account),
    80,
  );

  return (
    <Screen headerShown title={i18n.t("explore_suggest_title")}>
      <View style={styles.main}>
        <RefreshList
          data={mergeDataSource}
          renderItem={({ item }) => (
            <UserItem
              key={item.account.id}
              item={item.account}
              relationship={item.relationship}
            />
          )}
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

export default Suggestion;
