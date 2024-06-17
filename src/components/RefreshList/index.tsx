import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
  FlatList,
  FlatListProps,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useI18nStore from "../../store/useI18nStore";

export enum RefreshState {
  Idle = 0,
  HeaderRefreshing = 1,
  FooterRefreshing = 2,
  NoMoreData = 3,
  Failure = 4,
}

interface RefreshListProps extends FlatListProps<any> {
  refreshState?: RefreshState;
  onHeaderRefresh?: () => void;
  onFooterRefresh?: () => void;
  data: any[];

  footerContainerStyle?: StyleProp<ViewStyle>;
  footerTextStyle?: StyleProp<TextStyle>;
  emptyComponent?: React.ReactNode;

  footerRefreshingText?: string;
  footerFailureText?: string;
  footerNoMoreDataText?: string;
  canRefresh?: boolean;
}

export interface RefreshListRef {
  srollToTop: () => void;
  offset: () => number;
}

const RefreshList = forwardRef<RefreshListRef, RefreshListProps>(
  (props, ref) => {
    const { i18n } = useI18nStore();
    const {
      refreshState = RefreshState.Idle,
      renderItem,
      data = [0, 0, 0, 0, 0, 0],
      onFooterRefresh,
      onHeaderRefresh,
      emptyComponent,
      footerContainerStyle,
      footerTextStyle,
      footerRefreshingText = i18n.t("refresh_list_foot_text"),
      footerFailureText = i18n.t("refresh_list_foot_fail_text"),
      footerNoMoreDataText = i18n.t("refresh_list_foot_nomore_text"),
      canRefresh = true,
      ...options
    } = props;

    const listRef = useRef<FlatList>(null);
    const scrollOffset = useSharedValue(0);

    const [load, setLoad] = useState(true);
    const opcity = useSharedValue(1);
    useEffect(() => {
      if (data.length > 0 && opcity.value === 1) {
        opcity.value = withTiming(0, { duration: 400 }, () => {
          runOnJS(setLoad)(false);
        });
      }
    }, [data]);

    const endReached = () => {
      if (shouldStartFooterRefreshing() && canRefresh) {
        onFooterRefresh && onFooterRefresh();
      }
    };

    const headerRefresh = () => {
      if (shouldStartHeaderRefreshing() && canRefresh) {
        onHeaderRefresh && onHeaderRefresh();
      }
    };

    const shouldStartHeaderRefreshing = () => {
      if (
        refreshState === RefreshState.HeaderRefreshing ||
        refreshState === RefreshState.FooterRefreshing
      ) {
        return false;
      }

      return true;
    };

    const shouldStartFooterRefreshing = () => {
      if (data.length === 0) {
        return false;
      }

      return refreshState === RefreshState.Idle;
    };

    const renderFooter = () => {
      let footer = null;

      const footerStyle = [styles.footerContainer, footerContainerStyle];
      const textStyle = [styles.footerText, footerTextStyle];

      switch (refreshState) {
        case RefreshState.Idle:
          footer = <View style={footerStyle} />;
          break;
        case RefreshState.Failure: {
          footer = (
            <TouchableOpacity
              style={footerStyle}
              onPress={() => {
                onFooterRefresh && onFooterRefresh();
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
          if (data === null || data.length === 0) {
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
    };

    const loadViewStyle = useAnimatedStyle(() => {
      return {
        opacity: opcity.value,
      };
    });

    const onScroll = useAnimatedScrollHandler({
      onScroll(event) {
        scrollOffset.value = event.contentOffset.y;
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        srollToTop: () => {
          listRef.current &&
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
        },
        offset: () => {
          return scrollOffset.value;
        },
      }),
      [listRef],
    );

    return (
      <>
        <Animated.FlatList
          ref={listRef}
          data={data}
          onScroll={onScroll}
          renderItem={renderItem}
          onEndReached={endReached}
          onRefresh={headerRefresh}
          refreshing={refreshState === RefreshState.HeaderRefreshing}
          ListFooterComponent={renderFooter}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => index.toString()}
          {...options}
        />
        {load ? (
          <Animated.View style={[styles.emptyComponentView, loadViewStyle]}>
            {emptyComponent}
          </Animated.View>
        ) : null}
      </>
    );
  },
);

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  emptyComponentView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
  },
});

export default RefreshList;
