import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DefaultLineItem from "./defaultLineItem";
import HomeLineItem from "./homelineItem";
import { DefaultTabBar, RefreshList, TabView } from "../../components";
import { Colors, Screen } from "../../config";
import useAppStore from "../../store/useAppStore";
import useHomeStore from "../../store/useHomeStore";
import { navigate } from "../../utils";
import Local from "../found/local";

const Home: React.FC<object> = () => {
  const appStore = useAppStore();
  const { verifyToken, dataSource, onLoadMore, onRefresh, listStatus } =
    useHomeStore();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (
      appStore?.hostURL &&
      appStore?.token &&
      appStore?.hostURL?.length > 0 &&
      appStore?.token?.length > 0
    ) {
      verifyToken();
    } else {
      navigate("Guide");
    }
  }, [appStore.hostURL, appStore.token]);

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top, backgroundColor: "#fff" }} />
      <TabView
        tabBar={["推荐", "关注"]}
        initialPage={0}
        style={{ flex: 1 }}
        renderTabBar={() => (
          <DefaultTabBar
            tabBarWidth={Screen.width / 2}
            tabBarInactiveTextColor="#333"
            tabBarActiveTextColor={Colors.theme}
            tabBarTextStyle={{
              fontSize: 16,
              fontWeight: "bold",
            }}
            tabBarUnderlineStyle={{
              height: 4,
              backgroundColor: Colors.theme,
              width: 50,
              marginLeft: (Screen.width / 2 - 50) / 2,
            }}
          />
        )}
      >
        <View style={styles.main}>
          <Local tabLabel="推荐" />
        </View>
        <View style={styles.main}>
          <RefreshList
            data={dataSource}
            renderItem={({ item }) => <HomeLineItem item={item} />}
            onHeaderRefresh={onRefresh}
            onFooterRefresh={onLoadMore}
            refreshState={listStatus}
            emptyComponent={<DefaultLineItem />}
            keyExtractor={(item, index) => item?.id || index.toString()}
          />
        </View>
      </TabView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    width: Screen.width,
  },
});

export default Home;
