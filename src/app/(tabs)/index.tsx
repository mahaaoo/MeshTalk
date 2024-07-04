import { DefaultTabBar, TabView } from "@components";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import TimeLine from "@ui/home/timeLine";
import { homeLine, localLine, publicLine } from "../../server/timeline";

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
        tabBar={[
          i18n.t("home_tabview_title1"),
          i18n.t("home_tabview_title2"),
          i18n.t("home_tabview_title3"),
        ]}
        initialPage={0}
        style={{ flex: 1 }}
        onChangeTab={(index) => setIndex(index)}
        renderTabBar={() => (
          <DefaultTabBar
            tabBarWidth={width / 3}
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
              marginLeft: (width / 3 - 50) / 2,
            }}
          />
        )}
      >
        <TimeLine index={0} currentIndex={index} fetchTimeLine={localLine} />
        <TimeLine index={1} currentIndex={index} fetchTimeLine={homeLine} />
        <TimeLine index={2} currentIndex={index} fetchTimeLine={publicLine} />
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
