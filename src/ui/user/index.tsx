import {
  Avatar,
  StretchableImage,
  SlideHeader,
  FollowButton,
  Icon,
  HTMLContent,
  TabView,
  DefaultTabBar,
  PullLoading,
  ImagePreviewUtil,
} from "@components";
import {
  StringUtil,
  replaceContentEmoji,
  replaceNameEmoji,
} from "@utils/index";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  scrollTo,
  withTiming,
  withDecay,
} from "react-native-reanimated";

import {
  HeadTabViewContext,
  GestureTypeRef,
  IMAGE_HEIGHT,
  HEADER_HEIGHT,
  PULL_OFFSETY,
  RESET_TIMING_EASING,
  tabViewConfig,
  NestedScrollStatus,
} from "./type";
import UserLine from "./userLine";
import { Colors } from "../../config";
import { Account } from "../../config/interface";
import useAccountStore from "../../store/useAccountStore";
import useDeviceStore from "../../store/useDeviceStore";
import UserName from "../home/userName";

interface UserProps {
  id: string;
  userData: Account;
}

const User: React.FC<UserProps> = (props) => {
  const { userData, id } = props;

  const { insets, width, height } = useDeviceStore();
  const { currentAccount } = useAccountStore();

  const stickyHeight = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const scrollY = useSharedValue(0); // 最外层View的Y方向偏移量
  const offset = useSharedValue(0);
  const enable = useSharedValue(false);
  const [nativeRefs, setNativeRefs] = useState<GestureTypeRef[]>([]); // 子view里的scroll ref
  const arefs = useRef(new Array(tabViewConfig.length));

  const nestedScrollStatus = useSharedValue(NestedScrollStatus.OutScrolling);
  const refreshing = useSharedValue(false); // 是否处于下拉加载的状态

  // 返回上一页
  const handleBack = useCallback(router.back, []);
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

  const handleEdit = useCallback(() => {
    router.push({
      pathname: "/user/editInfo",
    });
  }, []);

  const handleAvatar = (url: string) => {
    ImagePreviewUtil.show(url, 0);
  };

  const main = useAnimatedStyle(() => {
    return {
      height: height + stickyHeight.value,
      transform: [
        {
          translateY: scrollY.value,
        },
      ],
    };
  });

  // useMemo是必须的，在切换到新tab之后，需要重新获取Gesture属性
  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .simultaneousWithExternalGesture(...nativeRefs)
    .onBegin(() => {
      offset.value = scrollY.value;
    })
    .onUpdate(({ translationY }) => {
      if (enable.value === true) {
        // 当内部在滚动的时候，停止手势响应，即外层不滚动, 当在临界点的时候，让向上滚动继续
        // console.log(translationY); ?
        if (
          scrollY.value === -stickyHeight.value &&
          translationY > 0 &&
          // 排除掉内部滚动正在进行中的情况
          nestedScrollStatus.value !== NestedScrollStatus.InnerScrolling
        ) {
          enable.value = false;
        } else {
          return;
        }
        return;
      }
      if (scrollY.value < 0) {
        // 外层向上移动到吸顶预设位置的时候，stop
        scrollY.value = Math.max(
          translationY + offset.value,
          -stickyHeight.value,
        );
        if (scrollY.value <= -stickyHeight.value) {
          if (enable.value === false) {
            /**
             * 当在外层滑动到哪层的临界点不松手的时候，内层enableScroll属性不刷新，无法无缝衔接到内层滚动
             * 用此函数补偿模拟内容滚动，当松手onEnd的时候，再设置enable，让内层开始真正滚动
             */
            scrollTo(
              arefs.current[currentIndex.value],
              0,
              Math.abs(translationY + offset.value + stickyHeight.value),
              false,
            );
          }
        } else {
          enable.value = false;
        }
      } else {
        scrollY.value = interpolate(translationY, [0, height], [0, height / 3]);
      }
    })
    .onEnd(({ velocityY }) => {
      if (scrollY.value > 0) {
        console.log("scrollY", scrollY.value);
        if (scrollY.value >= PULL_OFFSETY && !refreshing.value) {
          // runOnJS(setRefreshing)(true);
          console.log("触发下拉刷新PULL_OFFSETY");
          refreshing.value = true;
        }
        scrollY.value = withTiming(
          0,
          {
            easing: RESET_TIMING_EASING,
          },
          () => {
            // 确保mainTranslate回到顶端
            scrollY.value = 0;
          },
        );
      } else {
        if (enable.value === false) {
          // 在这里需要做一个根据速度的缓动
          scrollY.value = withDecay({
            velocity: velocityY,
            clamp: [-stickyHeight.value, 0],
          });
        }

        if (scrollY.value === -stickyHeight.value) {
          enable.value = true;
        }
      }
    });

  const handleChildRef = (ref: GestureTypeRef) => {
    if (!ref) return;
    const isExist = nativeRefs.find((item) => item.current === ref.current);
    if (isExist) return;
    setNativeRefs((p) => [...p, ref]);
  };

  return (
    <HeadTabViewContext.Provider
      value={{
        scrollY,
        handleChildRef,
        currentIndex,
        id,
        stickyHeight,
        enable,
        arefs,
        refreshing,
        nestedScrollStatus,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, main]}>
          <StretchableImage
            isblur={refreshing.value === true}
            scrollY={scrollY}
            url={userData?.header}
            imageHeight={IMAGE_HEIGHT}
          />
          <View style={styles.header} onLayout={handleOnLayout}>
            <View style={styles.avatarContainer}>
              <View style={styles.title}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <TouchableOpacity
                    style={styles.avatar}
                    onPress={() => handleAvatar(userData?.avatar)}
                  >
                    <Avatar
                      url={userData?.avatar}
                      size={65}
                      borderColor="#fff"
                      borderWidth={4}
                    />
                  </TouchableOpacity>
                  {userData?.locked ? (
                    // 锁定
                    <View style={{ margin: 3 }}>
                      <Icon name="lock" size={20} color="#aaa" />
                    </View>
                  ) : null}
                  {userData?.bot ? (
                    // 机器人
                    <View style={{ margin: 3 }}>
                      <Icon name="robot" size={22} color="#aaa" />
                    </View>
                  ) : null}
                </View>

                {currentAccount?.acct === userData.acct ? (
                  <TouchableOpacity
                    style={styles.editContainer}
                    onPress={handleEdit}
                  >
                    <Text style={styles.edit}>编辑个人资料</Text>
                  </TouchableOpacity>
                ) : (
                  <FollowButton id={id} locked={userData?.locked} />
                )}
              </View>
              <View style={{ marginTop: 5, flexDirection: "row" }}>
                <Text numberOfLines={10}>
                  <UserName
                    displayname={userData?.display_name || userData?.username}
                    emojis={userData?.emojis}
                    fontSize={18}
                  />
                </Text>
              </View>
              <Text style={styles.acct}>
                {StringUtil.acctName(userData?.acct)}
              </Text>

              <HTMLContent
                html={replaceContentEmoji(userData?.note, userData?.emojis)}
              />

              {userData?.fields?.length > 0
                ? userData?.fields?.map((field, index) => {
                    const values = replaceNameEmoji(
                      field.value,
                      userData?.emojis,
                    );
                    return (
                      <View
                        key={`fields${index}`}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginVertical: 3,
                        }}
                      >
                        <View style={{ width: 100 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: Colors.grayTextColor,
                              fontWeight: "bold",
                            }}
                          >
                            {field.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            marginHorizontal: 5,
                            height: "100%",
                            width: 1.5,
                            backgroundColor: Colors.grayTextColor,
                          }}
                        />
                        <Text>
                          {values.map((item, index) => {
                            return !item.image ? (
                              <Text key={`filedvalue${index}`}>
                                {item.text}
                              </Text>
                            ) : (
                              <Image
                                key={`filedvalue${index}`}
                                style={{ width: 16, height: 16 }}
                                source={{
                                  uri: item.text,
                                }}
                                contentFit="cover"
                              />
                            );
                          })}
                        </Text>
                      </View>
                    );
                  })
                : null}

              <View style={styles.act}>
                <Text style={styles.msgNumber}>
                  {StringUtil.stringAddComma(userData?.statuses_count)}
                  <Text style={styles.msg}>&nbsp;嘟文</Text>
                </Text>
                <Text
                  onPress={handleNavigateToFollowing}
                  style={[styles.msgNumber, styles.msgLeft]}
                >
                  {StringUtil.stringAddComma(userData?.following_count)}
                  <Text style={styles.msg}>&nbsp;关注</Text>
                </Text>
                <Text
                  onPress={handleNavigateToFans}
                  style={[styles.msgNumber, styles.msgLeft]}
                >
                  {StringUtil.stringAddComma(userData?.followers_count)}
                  <Text style={styles.msg}>&nbsp;粉丝</Text>
                </Text>
              </View>
            </View>
          </View>
          <TabView
            tabBar={tabViewConfig.map((tab) => tab.title)}
            initialPage={0}
            style={{ flex: 1 }}
            onChangeTab={(index) => {
              currentIndex.value = index;
            }}
            renderTabBar={() => (
              <DefaultTabBar
                tabBarWidth={width / tabViewConfig.length}
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
                  marginLeft: (width / tabViewConfig.length - 50) / 2,
                }}
              />
            )}
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
          </TabView>
        </Animated.View>
      </GestureDetector>
      <SlideHeader
        offsetY={IMAGE_HEIGHT}
        scrollY={scrollY}
        height={HEADER_HEIGHT}
      >
        <View style={[styles.slider, { marginTop: insets.top }]}>
          <UserName
            displayname={userData?.username}
            fontSize={18}
            emojis={userData?.emojis}
          />
        </View>
      </SlideHeader>
      <PullLoading
        scrollY={scrollY}
        refreshing={refreshing}
        top={IMAGE_HEIGHT / 2}
        left={width / 2}
        offsetY={PULL_OFFSETY}
      />
      <TouchableOpacity
        style={[styles.back, { top: insets.top + 10 }]}
        onPress={handleBack}
      >
        <Icon name="arrowLeft" color="#fff" size={18} />
      </TouchableOpacity>
    </HeadTabViewContext.Provider>
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
  avatar: {
    marginTop: -20,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  act: {
    flexDirection: "row",
    marginTop: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  acct: {
    fontSize: 14,
    color: Colors.grayTextColor,
    marginTop: 5,
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
  headerTab: {
    backgroundColor: "#fff",
  },
  tabBar: {
    justifyContent: "flex-start",
  },
  slider: {
    flexDirection: "row",
  },
  editContainer: {
    borderWidth: 1,
    borderColor: "#bbb",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  edit: {
    fontSize: 14,
  },
});

export default User;
