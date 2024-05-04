import { Header } from "@react-navigation/elements";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import DefaultLineItem from "./defaultLineItem";
import HomeLineItem from "./homelineItem";
import { RefreshList } from "../../components";
import { Colors, Screen } from "../../config";
import useAppStore from "../../store/useAppStore";
import useHomeStore from "../../store/useHomeStore";
import { navigate } from "../../utils";

const Home: React.FC<object> = () => {
  const appStore = useAppStore();
  const { verifyToken, dataSource, onLoadMore, onRefresh, listStatus } =
    useHomeStore();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log(appStore.hostURL, appStore.token);
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
      {/* <View style={{ backgroundColor: 'cyan', width: Screen.width, height: insets.top + 40 }} /> */}
      <Header title="首页" />
      <View style={styles.line} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
    width: Screen.width,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#eee",
  },
  loading: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
