import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { HEADER_HEIGHT } from "./type";
import { Error, RefreshState } from "../../components";
import { Colors } from "../../config";
import { Response, Timelines } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import { useRefreshList } from "../../utils/hooks";
import DefaultLineItem from "../home/defaultLineItem";
import StatusItem from "../statusItem";
import { Nested } from "react-native-maui";

interface UserLineProps {
  acct: string;
  index: number;
  fetchApi: (...args: any) => Response<Timelines[]>;
  onRefreshFinish: () => void;
}

const UserLine: React.FC<UserLineProps> = (props) => {
  const { index, fetchApi, acct, ...restProps } = props;
  const { dataSource, onRefresh, err, fetchData, onLoadMore, listStatus } =
    useRefreshList(fetchApi, "Normal", 20);
  const { width, height } = useDeviceStore();

  useEffect(() => {
    if (dataSource.length === 0) {
      fetchData();
    }
  }, []);

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
    <Nested.FlatList
      bounces={false}
      // 计算FlatList高度，需要减去吸顶高度和tabbar的高度
      style={{ flex: 1 }}
      scrollEventThrottle={16}
      data={dataSource}
      renderItem={({ item }) => {
        const showItem = item.reblog || item;
        return (
          <StatusItem item={item} sameUser={showItem.account.acct === acct} />
        );
      }}
      keyExtractor={(item, index) => item?.id || index.toString()}
      onEndReached={onLoadMore}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.1}
      {...restProps}
    />
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
