import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

import useDeviceStore from "../../store/useDeviceStore";

interface MyTabBarProps {
  goToPage?: (number: number) => void;
  activeTab?: number;
  tabs?: any[];
  backgroundColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  textStyle?: TextStyle;
  tabStyle?: ViewStyle;
  renderTab?: () => void;
  underlineStyle?: ViewStyle;
  tabBarUnderlineStyle?: ViewStyle;
  containerWidth?: number;
  scrollValue?: any;
  style?: ViewStyle;
}

interface MyTabBarItemProps extends MyTabBarProps {
  name: string;
  isTabActive: boolean;
  onPressHandler?: (number: number) => void;
}

const MyTabBarItem: React.FC<MyTabBarItemProps> = (props) => {
  const {
    activeTextColor = "#2593FC",
    inactiveTextColor = "black",
    textStyle,
    isTabActive,
    name,
    activeTab = 0,
    onPressHandler,
    tabStyle,
  } = props;
  const textColor = useMemo(() => {
    return isTabActive ? activeTextColor : inactiveTextColor;
  }, [isTabActive]);

  const fontWeight = useMemo(() => {
    return isTabActive ? "bold" : "normal";
  }, [isTabActive]);

  return (
    <TouchableOpacity
      style={styles.tabItem}
      key={name}
      accessible
      accessibilityLabel={name}
      onPress={() => onPressHandler && onPressHandler(activeTab)}
    >
      <View style={[styles.tab, tabStyle]}>
        <Text
          style={[styles.tabText, { color: textColor, fontWeight }, textStyle]}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const MyTabBar: React.FC<MyTabBarProps> = (props) => {
  const { width } = useDeviceStore();
  const {
    containerWidth = width,
    tabs,
    scrollValue,
    backgroundColor,
    style,
    activeTab = 0,
    goToPage,
    tabBarUnderlineStyle,
  } = props;
  const numberOfTabs = useMemo(() => {
    return tabs?.length || 0;
  }, [tabs]);

  const tabsWidth =
    useMemo(() => {
      return tabs?.map((item) => item.length * 17);
    }, [tabs]) || [];

  const marginLeft = useMemo(() => {
    return tabsWidth?.slice(0, activeTab).reduce((a, b) => a + b, 0);
  }, [tabsWidth, activeTab]);

  const tabUnderlineStyle = useMemo(() => {
    if (style && style.justifyContent === "flex-start") {
      return {
        position: "absolute",
        width: tabsWidth[activeTab] + 10,
        height: 4,
        backgroundColor: "#2593FC",
        bottom: 0,
        left: marginLeft + 5 * (activeTab + 1),
      };
    } else {
      return {
        position: "absolute",
        width: tabsWidth[activeTab] + 10,
        height: 4,
        backgroundColor: "#2593FC",
        bottom: 0,
        left: containerWidth / numberOfTabs - tabsWidth[activeTab] - 15,
      };
    }
  }, [containerWidth, numberOfTabs, activeTab]);

  let inAndOut = {};
  if (style && style.justifyContent === "flex-start") {
    inAndOut = {
      inputRange: [0, 1],
      outputRange: [0, 16],
    };
  } else {
    inAndOut = {
      inputRange: [0, 1],
      outputRange: [0, 52],
    };
  }

  const translateX = scrollValue.interpolate(inAndOut);

  return (
    <View style={[styles.tabs, { backgroundColor }, style]}>
      {tabs?.map((name, page) => {
        const isTabActive = activeTab === page;
        return (
          <MyTabBarItem
            key={`MyTabBarItem${page}`}
            name={name}
            activeTab={page}
            isTabActive={isTabActive}
            onPressHandler={goToPage}
          />
        );
      })}
      <Animated.View
        style={[
          //@ts-ignore
          tabUnderlineStyle,
          {
            transform: [{ translateX }],
          },
          tabBarUnderlineStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 10,
  },
  tabs: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "#eee",
  },
  tabItem: {
    paddingHorizontal: 10,
  },
  tabText: {
    fontSize: 17,
  },
});

export default MyTabBar;
