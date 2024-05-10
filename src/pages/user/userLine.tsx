import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  scrollTo,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

import {
  useHeadTabView,
  HEADER_HEIGHT,
  RESET_TIMING_EASING,
  NestedScrollStatus,
  NUMBER_AROUND,
} from "./type";
import { Screen } from "../../config";
import { Response, Timelines } from "../../config/interface";
import { useRefreshList } from "../../utils/hooks";
import HomeLineItem from "../home/timeLineItem";

interface UserLineProps {
  index: number;
  fetchApi: (...args) => Response<Timelines[]>;
  onRefreshFinish: () => void;
}

const UserLine: React.FC<UserLineProps> = (props) => {
  const { index, fetchApi, onRefreshFinish } = props;
  const {
    currentIndex,
    scrollY,
    handleChildRef,
    enable,
    arefs,
    stickyHeight,
    refreshing,
    nestedScrollStatus,
  } = useHeadTabView();
  const { dataSource, onRefresh, err, fetchData } = useRefreshList(
    fetchApi,
    "Normal",
    20,
  );

  const scroll = useSharedValue(0);
  const aref = useAnimatedRef();
  const nativeRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    "worklet";
    if (scroll.value > 0) {
      nestedScrollStatus.value = NestedScrollStatus.InnerScrolling;
    } else {
      nestedScrollStatus.value = NestedScrollStatus.OutScrolling;
    }
  }, [currentIndex]);

  useEffect(() => {
    const refresh = async () => {
      await onRefresh();
      onRefreshFinish && onRefreshFinish();
      scrollY.value = withTiming(-stickyHeight, {
        duration: 500,
        easing: RESET_TIMING_EASING,
      });
    };

    if (refreshing && index === currentIndex) {
      console.log("触发下拉刷新");
      refresh();
    }
  }, [index, currentIndex, refreshing]);

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => scrollY.value,
    (value) => {
      // // 当外层开始响应滚动的时候，所有内层滚动到顶
      // if (index === 0) {
      //   console.log("ad", {
      //     value,
      //     cc: -stickyHeight,
      //   });
      // }

      if (value > -stickyHeight + NUMBER_AROUND && scroll.value > 0) {
        console.log("reset");
        scrollTo(aref, 0, 0, false);
      } else {
        // scrollTo(aref, 0, -value, false);
      }
      // if (value < -stickyHeight) {
      //   console.log("aaaa", scroll.value);
      // }
    },
    [index, currentIndex, scroll],
  );

  useEffect(() => {
    if (aref) {
      arefs.current[index] = aref;
      // scrollTo(aref, 0, -scrollY.value, false);
    }
  }, [aref, index]);

  useEffect(() => {
    if (nativeRef.current) {
      console.log("NativeRef");
      handleChildRef && handleChildRef(nativeRef);
    }
  }, [nativeRef.current]);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scroll.value = event.contentOffset.y;
      // console.log("scroll", scroll.value);
      if (scroll.value < NUMBER_AROUND) {
        scrollTo(aref, 0, 0, false);
        enable.value = false;
      } else {
        nestedScrollStatus.value = NestedScrollStatus.InnerScrolling;
      }
    },
  });

  const nativeGesture = Gesture.Native().withRef(nativeRef);

  const animatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: enable.value,
    };
  });

  if (err) {
    return (
      <View
        style={{ height: Screen.height - HEADER_HEIGHT, width: Screen.width }}
      />
    );
  }

  return (
    <GestureDetector key={index} gesture={nativeGesture}>
      <Animated.FlatList
        ref={aref}
        bounces={false}
        onScroll={onScroll}
        style={{ height: Screen.height - HEADER_HEIGHT }}
        scrollEventThrottle={16}
        data={dataSource}
        renderItem={({ item }) => <HomeLineItem item={item} />}
        keyExtractor={(item, index) => item?.id || index.toString()}
        animatedProps={animatedProps}
      />
    </GestureDetector>
  );
};

export default UserLine;
