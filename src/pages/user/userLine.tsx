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
  runOnJS,
  runOnUI,
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
  const { index, fetchApi } = props;
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

  useAnimatedReaction(
    () => currentIndex.value,
    () => {
      if (dataSource.length === 0 && index === currentIndex.value) {
        runOnJS(fetchData)();
      }

      if (scroll.value > 0) {
        nestedScrollStatus.value = NestedScrollStatus.InnerScrolling;
      } else {
        nestedScrollStatus.value = NestedScrollStatus.OutScrolling;
      }
    },
    [scroll, dataSource, index],
  );

  const move = () => {
    "worklet";
    refreshing.value = false;
    scrollY.value = withTiming(-stickyHeight.value, {
      duration: 500,
      easing: RESET_TIMING_EASING,
    });
  };

  const handleRefresh = async () => {
    await onRefresh();
    runOnUI(move)();
  };

  useAnimatedReaction(
    () => refreshing.value,
    (value) => {
      if (value && index === currentIndex.value) {
        console.log("触发下拉刷新");
        runOnJS(handleRefresh)();
      }
    },
    [index, currentIndex],
  );

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => scrollY.value,
    (value) => {
      if (value > -stickyHeight.value + NUMBER_AROUND && scroll.value > 0) {
        console.log("reset");
        scrollTo(aref, 0, 0, false);
      }
    },
    [scroll],
  );

  useEffect(() => {
    if (aref) {
      arefs.current[index] = aref;
    }
  }, [aref, index]);

  useEffect(() => {
    if (nativeRef.current) {
      handleChildRef && handleChildRef(nativeRef);
    }
  }, [nativeRef.current]);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scroll.value = event.contentOffset.y;
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

  if (!dataSource || dataSource.length === 0) {
    return (
      <View
        style={{ height: Screen.height - HEADER_HEIGHT, width: Screen.width }}
      />
    );
  }

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
