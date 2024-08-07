import {
  StretchableImage,
  PullLoading,
  ListRow,
  SpacingBox,
  Icon,
  Screen,
  ActionsSheet,
} from "@components";
import UserHead from "@ui/user/userHead";
import { StringUtil } from "@utils/index";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { Colors } from "../../config";
import useAccountStore from "../../store/useAccountStore";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";

const IMAGEHEIGHT = 150; // 顶部下拉放大图片的高度
const PULLOFFSETY = 100; // 下拉刷新的触发距离

const Setting: React.FC<object> = () => {
  const scrollY = useSharedValue(0);
  const { currentAccount, verifyToken } = useAccountStore();
  const { width, insets } = useDeviceStore();
  const { i18n } = useI18nStore();
  const refreshing = useSharedValue(false); // 是否处于下拉加载的状态

  const handleEdit = useCallback(() => {
    router.push({
      pathname: "/user/editInfo",
    });
  }, []);

  const onRefresh = async () => {
    await verifyToken();
    refreshing.value = false;
  };

  const handleNavigateToFans = useCallback(() => {
    router.push({
      pathname: "/user/fans",
      params: {
        id: currentAccount?.id,
      },
    });
  }, [currentAccount]);

  const handleNavigateToFollowing = useCallback(() => {
    router.push({
      pathname: "/user/follow",
      params: {
        id: currentAccount?.id,
      },
    });
  }, [currentAccount]);

  const handleToDetail = useCallback(() => {
    router.push({
      pathname: "/user/[id]",
      params: {
        acct: currentAccount?.acct,
      },
    });
  }, [currentAccount]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = -event.contentOffset.y;
    },
    onEndDrag: () => {
      if (scrollY.value >= 100 && !refreshing.value) {
        refreshing.value = true;
        runOnJS(onRefresh)();
      }
    },
  });

  return (
    <Screen>
      <Animated.ScrollView
        style={styles.container}
        bounces
        onScroll={onScroll}
        scrollEventThrottle={1}
      >
        <StretchableImage
          isblur={refreshing.value}
          scrollY={scrollY}
          url={currentAccount!.header}
          imageHeight={IMAGEHEIGHT}
        />
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <UserHead
              userData={currentAccount!}
              isSelf
              onAvatarPress={handleToDetail}
            />

            <View style={styles.act}>
              <View style={styles.actItem}>
                <Text style={styles.msg_number}>
                  {StringUtil.stringAddComma(currentAccount!.statuses_count)}
                </Text>
                <Text style={styles.msg}>{i18n.t("user_post")}</Text>
              </View>
              <TouchableOpacity
                style={styles.actItem}
                onPress={handleNavigateToFollowing}
              >
                <Text style={styles.msg_number}>
                  {StringUtil.stringAddComma(currentAccount!.following_count)}
                </Text>
                <Text style={styles.msg}>{i18n.t("user_folloing")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actItem}
                onPress={handleNavigateToFans}
              >
                <Text style={styles.msg_number}>
                  {StringUtil.stringAddComma(currentAccount!.followers_count)}
                </Text>
                <Text style={styles.msg}>{i18n.t("user_follower")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <SpacingBox
          width={width}
          height={10}
          color={Colors.pageDefaultBackground}
        />
        <ListRow
          leftIcon={<Icon name="like" size={25} color="#333" />}
          title={i18n.t("setting_like")}
          onPress={() => {
            router.push("/favourites");
          }}
        />
        <ListRow
          leftIcon={<Icon name="bookmark" size={22} color="#333" />}
          title={i18n.t("setting_bookmark")}
          onPress={() => {
            router.push("/bookmark");
          }}
        />
        <ListRow
          leftIcon={<Icon name="mute" size={23} color="#333" />}
          title={i18n.t("setting_mute")}
          onPress={() => {
            router.push("/mutes");
          }}
        />
        <ListRow
          leftIcon={<Icon name="block" size={21} color="#333" />}
          title={i18n.t("setting_block")}
          onPress={() => {
            router.push("/blocks");
          }}
        />
        <ListRow
          leftIcon={<Icon name="hashTag" size={24} color="#333" />}
          title={i18n.t("setting_tag")}
          onPress={() => {
            router.push("/hashtag");
          }}
        />
        <ListRow
          leftIcon={<Icon name="announcement" size={24} color="#333" />}
          title={i18n.t("setting_announce")}
          onPress={() => {
            router.push("/announcement");
          }}
        />
        <ListRow
          leftIcon={<Icon name="preferences" size={24} color="#333" />}
          title={i18n.t("setting_preferences")}
          onPress={() => {
            router.push("/preferences");
          }}
        />
        <ListRow
          leftIcon={<Icon name="logout" size={22} color="#333" />}
          title={i18n.t("setting_logout")}
          onPress={() => {
            ActionsSheet.Logout.show();
          }}
        />
        <PullLoading
          scrollY={scrollY}
          refreshing={refreshing}
          top={IMAGEHEIGHT / 2}
          left={width / 2}
          offsetY={PULLOFFSETY}
        />
        <TouchableOpacity
          onPress={handleEdit}
          style={[styles.settingContainer, { top: insets.top + 20 }]}
        >
          <Icon name="setting" size={25} color="#fff" />
        </TouchableOpacity>
      </Animated.ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
  header: {
    backgroundColor: Colors.defaultWhite,
  },
  avatarContainer: {
    paddingHorizontal: 18,
  },
  act: {
    flexDirection: "row",
    marginVertical: 10,
    justifyContent: "space-around",
  },
  actItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  msg_number: {
    fontWeight: "bold",
    fontSize: 16,
  },
  msg: {
    fontWeight: "normal",
    color: Colors.grayTextColor,
    marginTop: 5,
  },
  settingContainer: {
    position: "absolute",
    right: 20,
    backgroundColor: "#333",
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Setting;
