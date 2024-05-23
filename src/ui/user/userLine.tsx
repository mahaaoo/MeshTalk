import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
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
import { Error, RefreshState } from "../../components";
import { Colors } from "../../config";
import { Response, Timelines } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import { useRefreshList } from "../../utils/hooks";
import DefaultLineItem from "../home/defaultLineItem";
import StatusItem from "../statusItem";

interface UserLineProps {
  acct: string;
  index: number;
  fetchApi: (...args: any) => Response<Timelines[]>;
  onRefreshFinish: () => void;
}

const UserLine: React.FC<UserLineProps> = (props) => {
  const { index, fetchApi, acct } = props;
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
  const { dataSource, onRefresh, err, fetchData, onLoadMore, listStatus } =
    useRefreshList(fetchApi, "Normal", 20);
  const { width, height } = useDeviceStore();

  const scroll = useSharedValue(0);
  const aref = useAnimatedRef<any>();
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

  const renderFooter = useCallback(() => {
    let footer = null;

    const footerRefreshingText = "数据加载中…";
    const footerFailureText = "点击重新加载";
    const footerNoMoreDataText = "已加载全部数据";

    const footerStyle = [styles.footerContainer];
    const textStyle = [styles.footerText];

    switch (listStatus) {
      case RefreshState.Idle:
        footer = <View style={footerStyle} />;
        break;
      case RefreshState.Failure: {
        footer = (
          <TouchableOpacity
            style={footerStyle}
            onPress={() => {
              onLoadMore && onLoadMore();
            }}
          >
            <Text style={textStyle}>{footerFailureText}</Text>
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.FooterRefreshing: {
        footer = (
          <View style={footerStyle}>
            <ActivityIndicator size="small" color="#888888" />
            <Text style={[textStyle, styles.footer]}>
              {footerRefreshingText}
            </Text>
          </View>
        );
        break;
      }
      case RefreshState.NoMoreData: {
        if (dataSource === null || dataSource.length === 0) {
          footer = <View />;
        } else {
          footer = (
            <View style={footerStyle}>
              <Text style={textStyle}>{footerNoMoreDataText}</Text>
            </View>
          );
        }
        break;
      }
      default:
        break;
    }

    return footer;
  }, [listStatus]);

  if (err) {
    return (
      <View
        style={{
          height: height - HEADER_HEIGHT,
          width,
          backgroundColor: Colors.defaultWhite,
          alignItems: "center",
        }}
      >
        <Error type="NoData" style={{ marginTop: 50 }} />
        <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
          暂时没有数据
        </Text>
      </View>
    );
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <View style={{ height: height - HEADER_HEIGHT, width }}>
        <DefaultLineItem scrollEnabled={false} />
      </View>
    );
  }

  return (
    <GestureDetector key={index} gesture={nativeGesture}>
      <Animated.FlatList
        ref={aref}
        bounces={false}
        onScroll={onScroll}
        // 计算FlatList高度，需要减去吸顶高度和tabbar的高度
        style={{ height: height - HEADER_HEIGHT - 50 }}
        scrollEventThrottle={16}
        data={dataSource}
        renderItem={({ item }) => {
          const showItem = item.reblog || item;
          return (
            <StatusItem item={item} sameUser={showItem.account.acct === acct} />
          );
        }}
        keyExtractor={(item, index) => item?.id || index.toString()}
        animatedProps={animatedProps}
        onEndReached={onLoadMore}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 44,
  },
  footerText: {
    fontSize: 14,
    color: "#555555",
  },
  footer: {
    marginLeft: 7,
  },
});

export default UserLine;
