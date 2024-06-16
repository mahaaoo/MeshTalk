import { DefaultTabBar, TabView } from "@components";
import HomeLine from "@ui/home/homeLine";
import Local from "@ui/home/localLine";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import useDeviceStore from "../../store/useDeviceStore";
// import i18n from "../../../locales";
import useI18nStore from "../../store/useI18nStore";

const Home: React.FC<object> = () => {
  const [index, setIndex] = useState(0);
  const { insets, width } = useDeviceStore();
  const { i18n } = useI18nStore();

  return (
    <View style={styles.container}>
      <View
        style={{
          width,
          height: insets.top,
          backgroundColor: "#fff",
        }}
      />
      <TabView
        tabBar={["推荐", "正在关注"]}
        initialPage={0}
        style={{ flex: 1 }}
        onChangeTab={(index) => setIndex(index)}
        renderTabBar={() => (
          <DefaultTabBar
            tabBarWidth={width / 2}
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
              marginLeft: (width / 2 - 50) / 2,
            }}
          />
        )}
      >
        <View style={styles.main}>
          <Local index={0} currentIndex={index} />
        </View>
        <View style={styles.main}>
          <HomeLine index={1} currentIndex={index} />
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
    width: useDeviceStore.getState().width,
  },
});

export default Home;
