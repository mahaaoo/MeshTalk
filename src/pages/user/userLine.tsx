import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureType,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  scrollTo,
  SharedValue,
  useAnimatedProps,
  runOnJS,
} from "react-native-reanimated";

import { useHeadTab } from "./headTabView";
import { RefreshList } from "../../components";
import { Colors, Screen } from "../../config";
import { getStatusesById } from "../../server/account";
import { useRefreshList } from "../../utils/hooks";
import DefaultLineItem from "../home/defaultLineItem";
import HomeLineItem from "../home/timeLineItem";

const HEADERHEIGHT = 104; // 上滑逐渐显示的Header的高度
const AnimatedRefreshList = Animated.createAnimatedComponent(FlatList);
type GestureTypeRef = React.MutableRefObject<GestureType | undefined>;

interface UserLineProps {
  id: string;
  index: number;
  currentIndex: number;
  mainTranslate: SharedValue<number>;
  handleChildRef: (ref: GestureTypeRef) => void;
  onScrollCallback: (y: number) => void;
  enable: SharedValue<boolean>;
  stickyHeight: number;
}

const UserLine: React.FC<UserLineProps> = (props) => {
  const {
    index,
    currentIndex,
    id,
    mainTranslate,
    handleChildRef,
    onScrollCallback,
    enable,
    stickyHeight,
    aref,
  } = props;
  const { dataSource, listStatus, onLoadMore, onRefresh } = useRefreshList(
    (params) => getStatusesById(id, params),
    "Normal",
    20,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  // const handleListener = (e: any) => {
  //   const offsetY = e.nativeEvent.contentOffset.y;
  //   if (offsetY < 1) {
  //     onTop && onTop();
  //     // 保证table滚到最上面
  //     table?.current?.scrollToOffset({ x: 0, y: 0, animated: true });
  //   }
  //   return null;
  // };

  const scroll = useSharedValue(0);
  // const aref = useAnimatedRef();
  const nativeRef = useRef();

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => mainTranslate.value,
    (value) => {
      if (index !== currentIndex) {
        // if (value === -stickyHeight) {
        //   scrollTo(aref, 0, Math.max(-value, scroll.value), false);
        // } else {
        //   scrollTo(aref, 0, -value, false);
        // }
      }
      // if (value === -stickyHeight) {
      //   console.log("可以滑动了");
      //   enable.value = true;
      // }
      // console.log({value, scroll});
      // scrollTo(aref, 0, -mainTranslate.value, false);
    },
    [index, currentIndex, scroll],
  );

  useEffect(() => {
    if (aref) {
      scrollTo(aref, 0, -mainTranslate.value, false);
    }
  }, [aref]);

  useEffect(() => {
    if (nativeRef.current) {
      console.log("NativeRef");
      handleChildRef && handleChildRef(nativeRef);
    }
  }, [nativeRef.current]);

  const onScroll = useAnimatedScrollHandler({
    onScroll(event) {
      scroll.value = event.contentOffset.y;
      console.log("scroll", scroll.value);
      if (scroll.value === 0) {
        enable.value = false;
      }
      // onScrollCallback && onScrollCallback(event.contentOffset.y);
    },
  });

  const nativeGesture = Gesture.Native().withRef(nativeRef);

  const animatedProps = useAnimatedProps(() => {
    return {
      scrollEnabled: enable.value,
    };
  });

  return (
    <GestureDetector gesture={nativeGesture}>
      <Animated.FlatList
        ref={aref}
        bounces={false}
        onScroll={onScroll}
        style={{ height: Screen.height - HEADERHEIGHT }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        data={dataSource}
        renderItem={({ item }) => <HomeLineItem item={item} />}
        keyExtractor={(item, index) => item?.id || index.toString()}
        animatedProps={animatedProps}
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "cyan",
  },
  freshList: {
    flex: 1,
    width: Screen.width,
  },
});

export default UserLine;
