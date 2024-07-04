import { Screen } from "@components";
import React from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";

interface PublicProps {
  tabLabel: string;
}

const Public: React.FC<PublicProps> = () => {
  const { i18n } = useI18nStore();

  return (
    <Screen headerShown title={i18n.t("tabbar_icon_explore")}>
      <View style={[styles.main]}>
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
