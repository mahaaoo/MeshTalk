import React, { useEffect, useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Loading } from "react-native-ma-modal";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  scrollTo,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  HeadTabViewContext,
  GestureTypeRef,
  IMAGE_HEIGHT,
  HEADER_HEIGHT,
  PULL_OFFSETY,
  RESET_TIMING_EASING,
} from "./type";
import UserLine from "./userLine";
import {
  Avatar,
  StretchableImage,
  PullLoading,
  SlideHeader,
  FollowButton,
  Icon,
  HTMLContent,
  TabView,
  DefaultTabBar,
} from "../../components";
import { Screen, Colors } from "../../config";
import { Account, Relationship } from "../../config/interface";
import { getAccountsById, getRelationships } from "../../server/account";
import { StringUtil, goBack, replaceContentEmoji, navigate } from "../../utils";
import LineItemName from "../home/lineItemName";
import { RouterProps } from "../index";

const { height } = Screen;

interface UserProps extends RouterProps<"User"> {}

const User: React.FC<UserProps> = (props) => {
  const { id } = props?.route?.params;

  const inset = useSafeAreaInsets();
  const [stickyHeight, setStickyHeight] = useState(0); // 为StickyHead计算顶吸到顶端的距离
  const [refreshing, setRefreshing] = useState(false); // 是否处于下拉加载的状态
  const [enableScrollViewScroll, setEnableScrollViewScroll] = useState(true); // 最外层ScrollView是否可以滚动
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userData, setUserData] = useState<Account>();
  const [relationship, setRelationship] = useState<Relationship[]>();

  useEffect(() => {
    const fetchUserData = async () => {
      Loading.show();
      const { data, ok } = await getAccountsById(id);
      if (ok && data) {
        setUserData(data);
      }
      Loading.hide();
    };

    const fetchRelationships = async () => {
      const { data, ok } = await getRelationships(id);
      if (ok && data) {
        setRelationship(data);
      }
    };

    fetchUserData();
    fetchRelationships();
  }, []);

  // 返回上一页
  const handleBack = useCallback(goBack, []);
  // 由于个人简介内容高度不定，所以在请求获取到内容之后，重新的吸顶测量高度
  const handleOnLayout = (e: any) => {
    const { height } = e.nativeEvent.layout;
    setStickyHeight(height + IMAGE_HEIGHT - HEADER_HEIGHT);
  };

  // 监听当前滚动位置
  const handleListener = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    // 下拉刷新
    if (offsetY <= -PULL_OFFSETY && !refreshing) {
      setRefreshing(true);
    }
    if (offsetY >= stickyHeight && enableScrollViewScroll) {
      setEnableScrollViewScroll(false);
    }
    return null;
  };

  // 当嵌套在里面内容滑动到顶端，将外层的ScrollView设置为可滑动状态
  const handleSlide = useCallback(() => {
    setEnableScrollViewScroll(true);
  }, []);

  const handleFinish = useCallback(() => {
    setRefreshing(false);
  }, []);

  const handleNavigateToFans = useCallback(() => {
    navigate("UserFans", { id });
  }, []);

  const handleNavigateToFollowing = useCallback(() => {
    navigate("UserFollow", { id });
  }, []);

  const scrollY = useSharedValue(0); // 最外层View的Y方向偏移量
  const offset = useSharedValue(0);
  const enable = useSharedValue(false);
  const [nativeRefs, setNativeRefs] = useState<GestureTypeRef[]>([]); // 子view里的scroll ref
  const arefs = useRef(new Array(4));

  const main = useAnimatedStyle(() => {
    return {
      height: height + stickyHeight,
      transform: [
        {
          translateY: scrollY.value,
        },
      ],
    };
  }, [stickyHeight]);

  const onScrollCallback = (y: number) => {
    "worklet";
    // console.log("???", y);
    if (y < 0) return;
    if (y <= stickyHeight) {
      scrollY.value = -y;
    } else {
      scrollY.value = -stickyHeight;
    }
  };

  // useMemo是必须的，在切换到新tab之后，需要重新获取Gesture属性
  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .simultaneousWithExternalGesture(...nativeRefs)
    .onBegin(() => {
      offset.value = scrollY.value;
    })
    .onUpdate(({ translationY }) => {
      if (enable.value === true) {
        // 当内部在滚动的时候，停止手势响应，即外层不滚动
        // console.log(translationY);
        // if (scrollY.value === -stickyHeight &&  translationY > 0) {
        //   enable.value = false;
        // } else {
        //   return;
        // }
        return;
      }
      if (scrollY.value < 0) {
        // 外层向上移动到吸顶预设位置的时候，stop
        scrollY.value = Math.max(translationY + offset.value, -stickyHeight);
        if (scrollY.value <= -stickyHeight) {
          if (enable.value === false) {
            /**
             * 当在外层滑动到哪层的临界点不松手的时候，内层enableScroll属性不刷新，无法无缝衔接到内层滚动
             * 用此函数补偿模拟内容滚动，当松手onEnd的时候，再设置enable，让内层开始真正滚动
             */
            scrollTo(
              arefs.current[currentIndex],
              0,
              Math.abs(translationY + offset.value + stickyHeight),
              false,
            );
          }
        } else {
          enable.value = false;
        }
      } else {
        scrollY.value = interpolate(translationY, [0, height], [0, height / 4]);
      }
    })
    .onEnd(() => {
      if (scrollY.value > 0) {
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
        if (scrollY.value === -stickyHeight) {
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
        onScrollCallback,
        currentIndex,
        id,
        stickyHeight,
        enable,
        arefs,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, main]}>
          <StretchableImage
            isblur={refreshing}
            scrollY={scrollY}
            url={userData?.header}
            imageHeight={IMAGE_HEIGHT}
          />
          <View style={styles.header} onLayout={handleOnLayout}>
            <View style={styles.avatarContainer}>
              <View style={styles.title}>
                <View style={styles.avatar}>
                  <Avatar
                    url={userData?.avatar}
                    size={65}
                    borderColor="#fff"
                    borderWidth={4}
                  />
                </View>
                <FollowButton relationships={relationship} id={id} />
              </View>
              <View style={{ marginTop: 5 }}>
                <LineItemName
                  displayname={userData?.display_name}
                  fontSize={18}
                />
                <Text style={styles.acct}>
                  <Text>@</Text>
                  {userData?.acct}
                </Text>
              </View>
              <HTMLContent html={replaceContentEmoji(userData?.note)} />
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
            tabBar={["嘟文", "嘟文和回复", "已置顶", "媒体"]}
            initialPage={0}
            style={{ flex: 1 }}
            onChangeTab={(index) => setCurrentIndex(index)}
            renderTabBar={() => (
              <DefaultTabBar
                tabBarWidth={Screen.width / 4}
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
                  marginLeft: (Screen.width / 4 - 50) / 2,
                }}
              />
            )}
          >
            <UserLine index={0} />
            <UserLine index={1} />
            <UserLine index={2} />
            <UserLine index={3} />
          </TabView>
        </Animated.View>
      </GestureDetector>
      <SlideHeader
        offsetY={IMAGE_HEIGHT}
        scrollY={scrollY}
        height={HEADER_HEIGHT}
      >
        <View style={[styles.slider, { marginTop: inset.top }]}>
          <LineItemName displayname={userData?.username} fontSize={18} />
        </View>
      </SlideHeader>
      <PullLoading
        scrollY={scrollY}
        refreshing={refreshing}
        top={IMAGE_HEIGHT / 2}
        left={Screen.width / 2}
        offsetY={PULL_OFFSETY}
      />
      <TouchableOpacity
        style={[styles.back, { top: inset.top + 10 }]}
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
    paddingHorizontal: 18,
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
    marginTop: 5,
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
});

export default User;
