import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeLine from "./homeLine";
import Local from "./localLine";
import { DefaultTabBar, TabView } from "../../components";
import { Colors, Screen } from "../../config";

const Home: React.FC<object> = () => {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: Screen.width,
          height: insets.top,
          backgroundColor: "#fff",
        }}
      />
      <TabView
        tabBar={["本站推荐", "正在关注"]}
        initialPage={0}
        style={{ flex: 1 }}
        onChangeTab={(index) => setIndex(index)}
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
    width: Screen.width,
  },
});

export default Home;
