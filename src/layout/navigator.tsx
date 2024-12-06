import { TabbedNavigator } from "./tabSlot";
import cssStyles from "../styles/root-layout.module.scss";
import { Link, Redirect } from "expo-router";
import React from "react";
import {
  Platform,
  Text,
  View,
  ViewStyle,
  Pressable,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Icon } from "../components/Icon";
import useAccountStore from "../store/useAccountStore";
import useI18nStore from "../store/useI18nStore";
import Avatar from "../components/Avatar";
import UserName from "@ui/home/userName";
import { Colors } from "../config";
import ActionsSheet from "../components/ActionsSheet";

const cns = (
  ...classes: (string | false | undefined | null)[]
): Record<string, any> => ({
  $$css: true,
  _: classes.filter(Boolean).join(" ") as unknown as string[],
});


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
  const { i18n } = useI18nStore();
  const { currentAccount } = useAccountStore();

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
          <View style={{ gap: 5, flex: 1 }}>
            <SideBarTabItem name="/" icon={() => <Icon name="elephant" size={28} color={'#2593FC'} />}>
              {i18n.t("tabbar_icon_home")}
            </SideBarTabItem>
            <SideBarTabItem name="/explore" icon={() => <Icon name="search" size={20} color={'#2593FC'} />}>
              {i18n.t("tabbar_icon_explore")}
            </SideBarTabItem>
            <SideBarTabItem name="/notify" icon={() => <Icon name="notify" size={22} color={'#2593FC'} />}>
              {i18n.t("tabbar_icon_notify")}
            </SideBarTabItem>
            <SideBarTabItem name="/setting" icon={() => <Icon name="user" size={22} color={'#2593FC'} />}>
              {i18n.t("tabbar_icon_setting")}
            </SideBarTabItem>
            <SideBarTabItem name="/publish" icon={() => <Icon name="plane" size={22} color={'#2593FC'} />}>
              {i18n.t("tabbar_icon_new")}
            </SideBarTabItem>
          </View>
          <TouchableOpacity onPress={() => ActionsSheet.Logout.show()}>
            <View style={[{ flexDirection: "row", flex: 1 }]}>
              <Avatar url={currentAccount?.avatar} />
              <View
                style={{
                  marginHorizontal: 10,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <UserName displayname={currentAccount?.display_name || ""} fontSize={16} />
                <Text 
                  style={{
                    fontSize: 13,
                    color: Colors.grayTextColor,                  
                  }}
                >
                  {currentAccount?.acct}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
  const { currentAccount } = useAccountStore();
  if (!currentAccount) {
    return <Redirect href="/welcome" />;
  }

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
    borderRightColor: "rgba(230, 230, 230, 1)",
    minWidth: 72,
    width: 72,
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  flex1: { flex: 1, backgroundColor: '#fff' },
  sidebarInner2: {
    flex: 1,
    alignItems: "stretch",
    height: "100%",
    justifyContent: "space-between",
  },
  nav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(230, 230, 230, 1)",
    justifyContent: "space-around",
    alignItems: "center",
    height: 49,
    paddingHorizontal: 16,
  },
});
