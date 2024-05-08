import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text } from "react-native";
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

import UserLine from "./userLine";
import { DefaultTabBar, TabView } from "../../components";
import { Colors, Screen } from "../../config";

const { height, width } = Screen;
const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);

interface HeadTabViewProps {
  children: React.ReactNode;
  id: string;
}

type GestureTypeRef = React.MutableRefObject<GestureType | undefined>;

export interface HeadTabViewContextProps {
  mainTranslate: SharedValue<number>;
  handleChildRef: (ref: GestureTypeRef) => void;
}

export const HeadTabViewContext = React.createContext<HeadTabViewContextProps>(
  {} as HeadTabViewContextProps,
);
export const useHeadTab = () => React.useContext(HeadTabViewContext);

const HEADER_HEIGHT = 100;

const HeadTabView: React.FC<HeadTabViewProps> = (props) => {
  const { children, id } = props;
  const mainTranslate = useSharedValue(0); // 最外层View的Y方向偏移量
  const [nativeRefs, setNativeRefs] = useState<GestureTypeRef[]>([]); // 子view里的scroll ref
  const [currentIndex, setCurrentIndex] = useState(0);

  const main = useAnimatedProps(() => {
    return {
      transform: [
        {
          translateY: mainTranslate.value,
        },
      ],
    };
  });

  const onScrollCallback = (y: number) => {
    "worklet";
    if (y < 0) return;
    if (y <= HEADER_HEIGHT) {
      mainTranslate.value = -y;
    } else {
      mainTranslate.value = -HEADER_HEIGHT;
    }
  };

  // useMemo是必须的，在切换到新tab之后，需要重新获取Gesture属性
  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetY([-10, 10])
      .simultaneousWithExternalGesture(...nativeRefs)
      .onBegin(() => {
        // offset.value = mainTranslate.value;
      })
      .onUpdate(({ translationY }) => {
        if (mainTranslate.value < 0) {
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
        }
      });
  }, [nativeRefs]);

  const handleChildRef = (ref: GestureTypeRef) => {
    if (!ref) return;
    const isExist = nativeRefs.find((item) => item.current === ref.current);
    if (isExist) return;
    setNativeRefs((p) => [...p, ref]);
  };

  const header = useAnimatedStyle(() => {
    if (mainTranslate.value < 0) {
      return {};
    }
    return {
      height: HEADER_HEIGHT + mainTranslate.value,
      transform: [
        // {
        //   scale: interpolate(
        //     mainTranslate.value,
        //     [0, height / 4],
        //     [1, 5],
        //     Extrapolation.CLAMP,
        //   ),
        // },
        {
          translateY: -mainTranslate.value,
        },
      ],
      justifyContent: "center",
      alignItems: "center",
    };
  });

  return (
    <HeadTabViewContext.Provider
      value={{
        mainTranslate,
        handleChildRef,
      }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={main}>
          <Animated.View
            style={[
              {
                height: HEADER_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "orange",
              },
              header,
            ]}
          >
            {children}
          </Animated.View>
          <TabView
            tabBar={["嘟文", "嘟文和回复", "已置顶", "媒体"]}
            initialPage={0}
            style={{ flex: 1 }}
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
            <UserLine id={id} />
            <UserLine id={id} />
            <UserLine id={id} />
            <UserLine id={id} />
          </TabView>
        </Animated.View>
      </GestureDetector>
    </HeadTabViewContext.Provider>
  );
};

interface HeadTabViewItemProps {
  index: number;
  currentIndex: number;
  onScrollCallback: (y: number) => void;
}

const HeadTabViewItem: React.FC<HeadTabViewItemProps> = (props) => {
  const { index, currentIndex, onScrollCallback } = props;

  const scroll = useSharedValue(0);
  const aref = useAnimatedRef();
  const { mainTranslate, handleChildRef } = useHeadTab();
  const nativeRef = useRef();

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => mainTranslate.value,
    (value) => {
      if (index !== currentIndex) {
        if (value === -HEADER_HEIGHT) {
          scrollTo(aref, 0, Math.max(-value, scroll.value), false);
        } else {
          scrollTo(aref, 0, -value, false);
        }
      }
    },
    [index, currentIndex],
  );

  useEffect(() => {
    if (aref) {
      scrollTo(aref, 0, -mainTranslate.value, false);
    }
  }, [aref]);

  useEffect(() => {
    if (nativeRef.current) {
      handleChildRef && handleChildRef(nativeRef);
    }
  }, [nativeRef.current]);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scroll.value = event.contentOffset.y;
      onScrollCallback && onScrollCallback(event.contentOffset.y);
    },
  });

  const ansyt = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scroll.value === 0 ? 0 : -mainTranslate.value,
        },
      ],
    };
  });

  const nativeGesture = Gesture.Native().withRef(nativeRef);

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.ScrollView
        ref={aref}
        bounces={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={{
          height: height * 3,
          width,
        }}
        style={{
          backgroundColor: TabListColor[index],
          width,
        }}
      >
        <Animated.View style={[ansyt, styles.itemContainer]}>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
          <Text style={{ fontSize: 30 }}>{`Tab${index + 1}`}</Text>
        </Animated.View>
      </Animated.ScrollView>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    width: Screen.width,
  },
});

export default HeadTabView;
