import {
  StretchableImage,
  PullLoading,
  ListRow,
  SpacingBox,
  Icon,
  Screen,
} from "@components";
import UserHead from "@ui/user/userHead";
import { StringUtil, StorageUtil } from "@utils/index";
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

const IMAGEHEIGHT = 150; // 顶部下拉放大图片的高度
const PULLOFFSETY = 100; // 下拉刷新的触发距离

const Setting: React.FC<object> = () => {
  const scrollY = useSharedValue(0);
  const { currentAccount, verifyToken } = useAccountStore();
  const { width, insets } = useDeviceStore();

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
  }, []);

  const handleNavigateToFollowing = useCallback(() => {
    router.push({
      pathname: "/user/follow",
      params: {
        id: currentAccount?.id,
      },
    });
  }, []);

  const handleToTest = useCallback(() => {
    router.push({
      pathname: "/user/[id]",
      params: {
        id: currentAccount?.id,
        acct: currentAccount?.acct,
      },
    });
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = -event.contentOffset.y;
    },
    onEndDrag: () => {
      if (scrollY.value >= 100 && !refreshing.value) {
        refreshing.value = true;
        runOnJS(onRefresh)();
      }
    }
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
              onAvatarPress={handleToTest}
            />

            <View style={styles.act}>
              <View style={styles.actItem}>
                <Text style={styles.msg_number}>
                  {StringUtil.stringAddComma(currentAccount!.statuses_count)}
                </Text>
                <Text style={styles.msg}>嘟文</Text>
              </View>
              <TouchableOpacity
                style={styles.actItem}
                onPress={handleNavigateToFollowing}
              >
                <Text style={styles.msg_number}>
                  {StringUtil.stringAddComma(currentAccount!.following_count)}
                </Text>
                <Text style={styles.msg}>关注</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actItem}
                onPress={handleNavigateToFans}
              >
                <Text style={styles.msg_number}>
                  {StringUtil.stringAddComma(currentAccount!.followers_count)}
                </Text>
                <Text style={styles.msg}>粉丝</Text>
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
          leftIcon={
            <Icon name="like" size={23} color={Colors.commonToolBarText} />
          }
          title="喜欢"
          onPress={() => {
            router.push("/favourites");
          }}
        />
        <ListRow
          leftIcon={
            <Icon name="like" size={23} color={Colors.commonToolBarText} />
          }
          title="退出"
          onPress={() => {
            StorageUtil.clear();
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
          style={{ position: "absolute", right: 20, top: insets.top }}
        >
          <Icon name="setting" size={25} color="#333" />
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
});
export default Setting;
