import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Local from "./local";
import Public from "./public";
import { MyTabBar } from "../../components";
import { Screen } from "../../config";

const Found: React.FC<object> = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.main, { paddingTop: insets.top }]}>
      <Public tabLabel="跨站" />
      {/* <ScrollableTabView
        style={styles.tabView}
        renderTabBar={() => <MyTabBar />}>
        <Local tabLabel="本站" />
        <Public tabLabel="跨站" />
      </ScrollableTabView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabView: {
    flex: 1,
    backgroundColor: "#fff",
    width: Screen.width,
  },
});

export default Found;
