import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {FlashList, FlashListProps} from '@shopify/flash-list';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export enum RefreshState {
  Idle = 0,
  HeaderRefreshing = 1,
  FooterRefreshing = 2,
  NoMoreData = 3,
  Failure = 4,
}

interface RefreshListProps extends FlashListProps<any> {
  refreshState?: RefreshState;
  onHeaderRefresh?: () => void;
  onFooterRefresh?: () => void;
  data: Array<any>;

  footerContainerStyle?: StyleProp<ViewStyle>;
  footerTextStyle?: StyleProp<TextStyle>;
  emptyComponent?: React.ReactNode;

  footerRefreshingText?: string;
  footerFailureText?: string;
  footerNoMoreDataText?: string;
  canRefresh?: boolean;
  ref?: any;
}

const RefreshList: React.FC<RefreshListProps> = props => {
  const {
    refreshState,
    data = [0, 0, 0, 0, 0, 0],
    onFooterRefresh,
    onHeaderRefresh,
    emptyComponent,
    footerContainerStyle,
    footerTextStyle,
    footerRefreshingText,
    footerFailureText,
    footerNoMoreDataText,
    canRefresh,
    ref,
    ...options
  } = props;

  const [load, setLoad] = useState(true);
  const opcity = useSharedValue(1);
  useEffect(() => {
    if (data.length > 0 && opcity.value === 1) {
      opcity.value = withTiming(0, {duration: 400}, () => {
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
            }}>
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

  return (
    <>
      <FlashList
        ref={ref}
        data={data}
        onEndReached={endReached}
        onRefresh={headerRefresh}
        estimatedItemSize={200}
        refreshing={refreshState === RefreshState.HeaderRefreshing}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.1}
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
};

RefreshList.defaultProps = {
  footerRefreshingText: '数据加载中…',
  footerFailureText: '点击重新加载',
  footerNoMoreDataText: '已加载全部数据',
  canRefresh: true,
  refreshState: RefreshState.Idle,
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 44,
  },
  footerText: {
    fontSize: 14,
    color: '#555555',
  },
  footer: {
    marginLeft: 7,
  },
  emptyComponentView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
});

export default RefreshList;
