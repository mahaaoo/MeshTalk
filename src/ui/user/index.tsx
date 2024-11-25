import {
  StretchableImage,
  SlideHeader,
  Icon,
  ImagePreviewUtil,
} from "@components";
import { StringUtil } from "@utils/index";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { IMAGE_HEIGHT, HEADER_HEIGHT } from "./type";
import UserHead from "./userHead";
import UserLine from "./userLine";
import { Colors } from "../../config";
import { Account } from "../../config/interface";
import {
  getStatusesById,
  getStatusesReplyById,
  getStatusesMediaById,
  getStatusesPinById,
} from "../../server/account";
import useAccountStore from "../../store/useAccountStore";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import UserName from "../home/userName";

import { NestedTabView } from "react-native-maui";

interface UserProps {
  id: string; // 该账号id
  userData: Account; // 要展示的用户账号内容
}

const User: React.FC<UserProps> = (props) => {
  const { userData, id } = props;

  const { insets } = useDeviceStore();
  const { currentAccount } = useAccountStore();
  const { i18n } = useI18nStore();

  const stickyHeight = useSharedValue(0);

  const scrollY = useSharedValue(0); // 最外层View的Y方向偏移量
  const refreshing = useSharedValue(false); // 是否处于下拉加载的状态

  // 返回上一页
  const handleBack = useCallback(() => router.back(), []);
  // 由于个人简介内容高度不定，所以在请求获取到内容之后，重新的吸顶测量高度
  const handleOnLayout = (e: any) => {
    const { height } = e.nativeEvent.layout;
    stickyHeight.value = height + IMAGE_HEIGHT - HEADER_HEIGHT;
  };

  const handleNavigateToFans = useCallback(() => {
    router.push({
      pathname: "/user/fans",
      params: {
        id,
      },
    });
  }, [id]);

  const handleNavigateToFollowing = useCallback(() => {
    router.push({
      pathname: "/user/follow",
      params: {
        id,
      },
    });
  }, [id]);

  const handleAvatar = (url: string) => {
    ImagePreviewUtil.show(url, 0);
  };

  const tabViewConfig = useMemo(
    () => [
      {
        fetchApi: (id: string) => (params: object) =>
          getStatusesById(id, params),
        title: i18n.t("user_tabview_post"),
      },
      {
        fetchApi: (id: string) => (params: object) =>
          getStatusesReplyById(id, params),
        title: i18n.t("user_tabview_reply"),
      },
      {
        fetchApi: (id: string) => (params: object) =>
          getStatusesPinById(id, params),
        title: i18n.t("user_tabview_pin"),
      },
      {
        fetchApi: (id: string) => (params: object) =>
          getStatusesMediaById(id, params),
        title: i18n.t("user_tabview_media"),
      },
    ],
    [i18n],
  );

  return (
    <View style={{ flex: 1 }}>
      <NestedTabView
        stickyHeight={55 + HEADER_HEIGHT}
        style={{ flex: 1 }}
        tabBarflex="equal-width"
        tabs={tabViewConfig?.map((item) => item.title)}
        inactiveTextColor="#333"
        activeTextColor={Colors.theme}
        tabBarItemTitleStyle={{
          fontSize: 16,
          fontWeight: "bold",
        }}
        defaultSliderStyle={{
          height: 4,
          backgroundColor: Colors.theme,
        }}
        renderHeader={() => (
          <>
            <StretchableImage
              isblur={refreshing.value === true}
              scrollY={scrollY}
              url={userData?.header}
              imageHeight={IMAGE_HEIGHT}
            />
            <View style={styles.header} onLayout={handleOnLayout}>
              <View style={styles.avatarContainer}>
                <UserHead
                  userData={userData}
                  isSelf={userData?.acct === currentAccount?.acct}
                  onAvatarPress={handleAvatar}
                />
                <View style={styles.act}>
                  <Text style={styles.msgNumber}>
                    {StringUtil.stringAddComma(userData?.statuses_count)}
                    <Text style={styles.msg}>&nbsp;{i18n.t("user_post")}</Text>
                  </Text>
                  <Text
                    onPress={handleNavigateToFollowing}
                    style={[styles.msgNumber, styles.msgLeft]}
                  >
                    {StringUtil.stringAddComma(userData?.following_count)}
                    <Text style={styles.msg}>
                      &nbsp;{i18n.t("user_folloing")}
                    </Text>
                  </Text>
                  <Text
                    onPress={handleNavigateToFans}
                    style={[styles.msgNumber, styles.msgLeft]}
                  >
                    {StringUtil.stringAddComma(userData?.followers_count)}
                    <Text style={styles.msg}>
                      &nbsp;{i18n.t("user_follower")}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
        onNestedScroll={(offset) => {
          scrollY.value = offset;
        }}
      >
        {tabViewConfig.map((tab, index) => (
          <UserLine
            key={tab.title}
            index={index}
            acct={userData.acct}
            fetchApi={tab.fetchApi(id)}
            onRefreshFinish={() => {
              refreshing.value = false;
            }}
          />
        ))}
      </NestedTabView>
      <SlideHeader
        offsetY={IMAGE_HEIGHT}
        scrollY={scrollY}
        height={HEADER_HEIGHT}
      >
        <View style={[styles.slider, { marginTop: insets.top }]}>
          <UserName
            displayname={userData?.display_name || userData?.username}
            fontSize={18}
            emojis={userData?.emojis}
          />
        </View>
      </SlideHeader>
      <TouchableOpacity
        style={[styles.back, { top: insets.top + 10 }]}
        onPress={handleBack}
      >
        <Icon name="arrowLeft" color="#fff" size={18} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pageDefaultBackground,
  },
  back: {
    position: "absolute",
    left: 15,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: Colors.defaultWhite,
    paddingBottom: 10,
  },
  avatarContainer: {
    marginHorizontal: 15,
  },
  act: {
    flexDirection: "row",
    marginTop: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  msgNumber: {
    fontWeight: "bold",
  },
  msgLeft: {
    marginLeft: 10,
  },
  msg: {
    fontWeight: "normal",
    color: Colors.grayTextColor,
  },
  slider: {
    flexDirection: "row",
  },
});

export default User;
