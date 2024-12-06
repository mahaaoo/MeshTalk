import { TabbedNavigator } from "./tabSlot";
import cssStyles from "../styles/root-layout.module.scss";
import { Link, Redirect } from "expo-router";
import React from "react";
import {
  Platform,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
  Pressable,
  StyleSheet
} from "react-native";
import { Icon } from "../components/Icon";
import useAccountStore from "../store/useAccountStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const cns = (
  ...classes: (string | false | undefined | null)[]
): Record<string, any> => ({
  $$css: true,
  _: classes.filter(Boolean).join(" ") as unknown as string[],
});

function useWidth(size: number) {
  if (typeof window === "undefined") {
    return true;
  }
  const { width } = useWindowDimensions();
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return false;
  }
  return width >= size;
}

function SideBarTabItem({
  children,
  icon,
  name,
}: {
  children: string;
  icon: (props: { focused?: boolean }) => JSX.Element;
  name: string;
}) {
  return (
    <TabBarItem
      name={name}
      id={name}
      style={{
        height: 50,
        width: "100%",
        justifyContent: 'center',
      }}
    >
      {({ focused, hovered }) => (
        <View
          style={[
            {
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 999,
              transitionProperty: ["background-color", "box-shadow"],
              transitionDuration: "200ms",
            },
            hovered && {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
          ]}
        >
          <View
            style={[
              {
                width: 25,
                justifyContent: 'center',
                alignItems: 'center',
              },
              {
                transitionTimingFunction: "cubic-bezier(0.17, 0.17, 0, 1)",
                transitionProperty: ["transform"],
                transitionDuration: "150ms",
              },
              hovered && {
                transform: [{ scale: 1.1 }],
              },
            ]}
          >
            {icon({
              focused
            })}
          </View>

          <Text
            style={[
              {
                color: "#000",
                fontSize: 16,
                marginLeft: 16,
                marginRight: 16,
                lineHeight: 24,
              },
              Platform.select({
                web: cns(cssStyles.sideBarTabItemText),
              }),
              focused && {
                color: '#fff',
                fontWeight: "bold",
              },
            ]}
          >
            {children}
          </Text>
        </View>
      )}
    </TabBarItem>
  );
}

function SideBar() {
  return (
    <View
      style={[
        jsStyles.sideBar,
        Platform.select({
          web: [cns(cssStyles.largeVisible, cssStyles.sideBar)],
        }),
      ]}
    >
      <View
        style={[
          jsStyles.sidebarInner,
          ...Platform.select({
            web: [cns(cssStyles.sideBarInner)],
          }),
        ]}
      >
        <View
          style={[
            jsStyles.sidebarInner2,
            Platform.select({
              web: cns(cssStyles.sideBarHeader),
            }),
          ]}
        >
          <View style={{ gap: 4, flex: 1 }}>
            <SideBarTabItem name="/" icon={() => <Icon name="elephant" size={28} color={'#2593FC'} />}>
              Home
            </SideBarTabItem>
            <SideBarTabItem name="/explore" icon={() => <Icon name="search" size={20} color={'#2593FC'} />}>
              Explore
            </SideBarTabItem>
            <SideBarTabItem name="/notify" icon={() => <Icon name="notify" size={22} color={'#2593FC'} />}>
              Notify
            </SideBarTabItem>
            <SideBarTabItem name="/setting" icon={() => <Icon name="user" size={22} color={'#2593FC'} />}>
              More
            </SideBarTabItem>
          </View>
          <View>
            <SideBarTabItem name="/publish" icon={() => <Icon name="plane" size={22} color={'#2593FC'} />}>
              Post
            </SideBarTabItem>
          </View>
        </View>
      </View>
    </View>
  );
}


function useIsTabSelected(name: string): boolean {
  const { navigation } = TabbedNavigator.useContext();

  const state = navigation.getState();
  const current = state.routes.find((route, i) => state.index === i);

  console.log({
    name,
    state
  });

  return current?.name === name;
}

function TabBarItem({
  children,
  name,
  style,
  id,
}: {
  children?: any;
  name: string;
  style?: ViewStyle;
  id: string;
}) {
  const focused = useIsTabSelected(id);

  if (name.startsWith("/") || name.startsWith(".")) {
    return (
      <Link href={name} asChild style={style}>
        <Pressable>{(props) => children({ ...props, focused })}</Pressable>
      </Link>
    );
  }

  return (
    <TabbedNavigator.Link name={id} asChild style={style}>
      <Pressable>{(props) => children({ ...props, focused })}</Pressable>
    </TabbedNavigator.Link>
  );
}


export function ResponsiveNavigator() {
  // const { currentAccount } = useAccountStore();
  // if (!currentAccount) {
  //   return <Redirect href="/welcome" />;
  // }

  return (
    <TabbedNavigator
    screenOptions={{
      tabBarShowLabel: false,
      headerShown: true,
      tabBarActiveTintColor: "black",
    }}>
      <View
        style={[
          jsStyles.flex1,
          Platform.select({
            web: cns(cssStyles.container),
          }),
        ]}
      >
        <SideBar />
        <TabbedNavigator.Slot />
      </View>
    </TabbedNavigator>
  );
}

const Colors = {
  lightGray: "rgba(230, 230, 230, 1)",
  dark: "rgba(41, 41, 41, 1)",
};

const jsStyles = StyleSheet.create({
  sideBar: {
    minWidth: 72,
    width: 72,
  },
  sidebarInner: {
    position: Platform.select({ web: "fixed", default: "absolute" }),
    height: "100%",
    maxHeight: "100%",
    alignItems: "stretch",
    borderRightWidth: 1,
    borderRightColor: Colors.lightGray,
    minWidth: 72,
    width: 72,
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  flex1: { flex: 1, backgroundColor: '#fff' },
  appHeader: {
    zIndex: 10,
    backgroundColor: "white",
    position: Platform.select({ web: "fixed", default: "absolute" }),
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sidebarInner2: {
    flex: 1,
    alignItems: "stretch",
    height: "100%",
    justifyContent: "space-between",
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    justifyContent: "space-around",
    alignItems: "center",
    height: 49,
    paddingHorizontal: 16,
  },
});
