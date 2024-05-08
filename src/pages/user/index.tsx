import { useNavigation } from "@react-navigation/native";
import React, {
  useRef,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureType,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  scrollTo,
  useAnimatedReaction,
  Extrapolation,
  withTiming,
  Easing,
  SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HeadTabView from "./headTabView";
import UserLine from "./userLine";
import {
  MyTabBar,
  Avatar,
  StickyHeader,
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
import {
  getAccountsById,
  getStatusesById,
  getStatusesReplyById,
  getStatusesMediaById,
  getStatusesPinById,
  getRelationships,
} from "../../server/account";
import {
  StringUtil,
  useRequest,
  goBack,
  replaceContentEmoji,
  navigate,
} from "../../utils";
import LineItemName from "../home/lineItemName";
import { RouterProps } from "../index";

const { height, width } = Screen;

const fetchUserById = (id: string = "") => {
  const fn = () => {
    return getAccountsById(id);
  };
  return fn;
};

const fetchRelationships = (id: string) => {
  const fn = () => {
    return getRelationships(id);
  };
  return fn;
};

type GestureTypeRef = React.MutableRefObject<GestureType | undefined>;
const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);

interface UserProps extends RouterProps<"User"> {}

const IMAGEHEIGHT = 150; // 顶部下拉放大图片的高度
const HEADERHEIGHT = 104; // 上滑逐渐显示的Header的高度, sticky最终停止的高度
const PULLOFFSETY = 100; // 下拉刷新的触发距离

// const HEADER_HEIGHT = IMAGEHEIGHT + 100 - HEADERHEIGHT;

const User: React.FC<UserProps> = (props) => {
  // const scrollY: any = useRef(new Animated.Value(0)).current; //最外层ScrollView的滑动距离
  const scrollY = useSharedValue(0);
  const { id } = props?.route?.params;

  const inset = useSafeAreaInsets();
  const { data: userData, run: getUserData } = useRequest(fetchUserById(id), {
    manual: true,
    loading: true,
  }); // 获取用户的个人信息
  const { data: relationship, run: getRelationship } = useRequest(
    fetchRelationships(id),
    {
      manual: true,
      loading: false,
    },
  );

  const [stickyHeight, setStickyHeight] = useState(0); // 为StickyHead计算顶吸到顶端的距离
  const [refreshing, setRefreshing] = useState(false); // 是否处于下拉加载的状态
  const [enableScrollViewScroll, setEnableScrollViewScroll] = useState(true); // 最外层ScrollView是否可以滚动
  const [currentIndex, setCurrentIndex] = useState(0);

  // const onScroll = useAnimatedScrollHandler({
  //   onScroll: (event, context) => {
  //     scrollY.value = event.contentOffset.y;
  //   }
  // });

  useEffect(() => {
    getUserData();
    getRelationship();
  }, []);

  // 返回上一页
  const handleBack = useCallback(goBack, []);
  // 由于个人简介内容高度不定，所以在请求获取到内容之后，重新的吸顶测量高度
  const handleOnLayout = (e: any) => {
    const { height } = e.nativeEvent.layout;
    console.log({
      setHeight: height + IMAGEHEIGHT - HEADERHEIGHT,
    });
    setStickyHeight(height + IMAGEHEIGHT - HEADERHEIGHT);
  };
  // 监听当前滚动位置
  const handleListener = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    // 下拉刷新
    if (offsetY <= -PULLOFFSETY && !refreshing) {
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

  const mainTranslate = useSharedValue(0); // 最外层View的Y方向偏移量
  const offset = useSharedValue(0);
  const enable = useSharedValue(false);
  const [nativeRefs, setNativeRefs] = useState<GestureTypeRef[]>([]); // 子view里的scroll ref
  const aref1 = useAnimatedRef();
  const aref2 = useAnimatedRef();
  const aref3 = useAnimatedRef();
  const aref4 = useAnimatedRef();

  const main = useAnimatedStyle(() => {
    return {
      height: height + stickyHeight,
      transform: [
        {
          translateY: mainTranslate.value,
        },
      ],
    };
  }, [stickyHeight]);

  const onScrollCallback = (y: number) => {
    "worklet";
    // console.log("???", y);
    if (y < 0) return;
    if (y <= stickyHeight) {
      mainTranslate.value = -y;
    } else {
      mainTranslate.value = -stickyHeight;
    }
  };

  useAnimatedReaction(() => enable.value, (value) => {
  console.log("是否可滑动", value);
  });


  // useMemo是必须的，在切换到新tab之后，需要重新获取Gesture属性
  const panGesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .simultaneousWithExternalGesture(...nativeRefs)
    .onBegin(() => {
      offset.value = mainTranslate.value;
      // offset.value = mainTranslate.value;
      console.log("onBegin", mainTranslate.value);
    })
    .onUpdate(({ translationY }) => {
      // console.log({
      //   translationY,
      //   mainTranslate: mainTranslate.value,
      // });
      if (enable.value === true) {
        // console.log(translationY);
        // if (mainTranslate.value === -stickyHeight &&  translationY > 0) {
        //   enable.value = false;
        // } else {
        //   return;
        // }
        return;
      };
      if (mainTranslate.value < 0) {
        mainTranslate.value = Math.max(
          translationY + offset.value,
          -stickyHeight,
        );
        if (mainTranslate.value <= -stickyHeight) {
          // enable.value = true;
          if (enable.value === false) {
            console.log("补偿补偿补偿补偿", enable.value);
            scrollTo(
              aref1,
              0,
              Math.abs(translationY + offset.value + stickyHeight),
              false,
            );
          }
        } else {
          enable.value = false;
          // console.log("222");
        }
      } else {
        mainTranslate.value = interpolate(
          translationY,
          [0, height],
          [0, height / 4],
        );
      }
    })
    .onEnd(() => {
      if (mainTranslate.value > 0) {
        console.log("onEndonEnd", mainTranslate.value);
        mainTranslate.value = withTiming(
          0,
          {
            easing: RESET_TIMING_EASING,
          },
          () => {
            console.log("onEndonEnd", mainTranslate.value);
            // 确保mainTranslate回到顶端
            mainTranslate.value = 0;
          },
        );
      } else {
        if (mainTranslate.value === -stickyHeight) {
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
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, main]}>
          <StretchableImage
            isblur={refreshing}
            scrollY={scrollY}
            url={userData?.header}
            imageHeight={IMAGEHEIGHT}
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
            <UserLine
              index={0}
              {...{
                mainTranslate,
                handleChildRef,
                onScrollCallback,
                currentIndex,
                id,
                enable,
                stickyHeight,
                aref: aref1,
              }}
            />
            <UserLine
              index={1}
              {...{
                mainTranslate,
                handleChildRef,
                onScrollCallback,
                currentIndex,
                id,
                enable,
                stickyHeight,
                aref: aref2,
              }}
            />
            <UserLine
              index={2}
              {...{
                mainTranslate,
                handleChildRef,
                onScrollCallback,
                currentIndex,
                id,
                enable,
                stickyHeight,
                aref: aref3,
              }}
            />
            <UserLine
              index={3}
              {...{
                mainTranslate,
                handleChildRef,
                onScrollCallback,
                currentIndex,
                id,
                enable,
                stickyHeight,
                aref: aref4,
              }}
            />
          </TabView>
        </Animated.View>
      </GestureDetector>
      <SlideHeader
        offsetY={IMAGEHEIGHT}
        scrollY={scrollY}
        height={HEADERHEIGHT}
      >
        <View style={[styles.slider, { marginTop: inset.top }]}>
          <LineItemName displayname={userData?.username} fontSize={18} />
        </View>
      </SlideHeader>
      {/* <PullLoading
        scrollY={scrollY}
        refreshing={refreshing}
        top={IMAGEHEIGHT / 2}
        left={Screen.width / 2}
        offsetY={PULLOFFSETY}
      /> */}
      <TouchableOpacity
        style={[styles.back, { top: inset.top + 10 }]}
        onPress={handleBack}
      >
        <Icon name="arrowLeft" color="#fff" size={18} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
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
    backgroundColor: "orange",
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
