import React, { useEffect, useRef } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  scrollTo,
  useAnimatedProps,
} from "react-native-reanimated";

import { useHeadTabView, HEADER_HEIGHT } from "./type";
import { Screen } from "../../config";
import { getStatusesById } from "../../server/account";
import { useRefreshList } from "../../utils/hooks";
import HomeLineItem from "../home/timeLineItem";

interface UserLineProps {
  index: number;
}

const UserLine: React.FC<UserLineProps> = (props) => {
  const { index } = props;
  const {
    currentIndex,
    id,
    scrollY,
    handleChildRef,
    enable,
    arefs,
    stickyHeight,
  } = useHeadTabView();
  const { dataSource, onRefresh } = useRefreshList(
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
  const aref = useAnimatedRef();
  const nativeRef = useRef();

  // 当某一个tab滑到顶，所有重置所有tab
  useAnimatedReaction(
    () => scrollY.value,
    (value) => {
      if (index !== currentIndex) {
        if (value < -stickyHeight) {
          scrollTo(aref, 0, Math.max(-value, scroll.value), false);
        } else {
          scrollTo(aref, 0, -value, false);
        }
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
      if (scroll.value < 5) {
        scrollTo(aref, 0, 0, false);
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
        style={{ height: Screen.height - HEADER_HEIGHT }}
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

export default UserLine;
