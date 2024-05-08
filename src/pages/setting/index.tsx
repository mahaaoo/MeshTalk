import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

import {
  Avatar,
  StretchableImage,
  PullLoading,
  HTMLContent,
  ListRow,
  SpacingBox,
  Icon,
} from "../../components";
import { Colors, Screen } from "../../config";
import useAccountStore from "../../store/useAccountStore";
import {
  StringUtil,
  navigate,
  StorageUtil,
  replaceContentEmoji,
} from "../../utils";
import LineItemName from "../home/lineItemName";

const IMAGEHEIGHT = 150; // 顶部下拉放大图片的高度
const PULLOFFSETY = 100; // 下拉刷新的触发距离

const Setting: React.FC<object> = () => {
  // const scrollY: any = useRef(new Animated.Value(0)).current; //最外层ScrollView的滑动距离
  const scrollY = useSharedValue(0);
  const { currentAccount, verifyToken } = useAccountStore();

  const [refreshing, setRefreshing] = useState(false); // 是否处于下拉加载的状态

  const handleListener = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY <= -PULLOFFSETY && !refreshing) {
      setRefreshing(true);
    }
    return null;
  };

  useEffect(() => {
    if (refreshing) {
      verifyToken();
    }
  }, [refreshing]);

  useEffect(() => {
    if (currentAccount) {
      setRefreshing(false);
    }
  }, [currentAccount]);

  const handleNavigateToFans = useCallback(() => {
    navigate("UserFans", { id: currentAccount?.id });
  }, []);

  const handleNavigateToFollowing = useCallback(() => {
    navigate("UserFollow", { id: currentAccount?.id });
  }, []);

  const handleToTest = useCallback(() => {
    navigate("User", { id: currentAccount?.id });
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event, context) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  return (
    <Animated.ScrollView
      style={styles.container}
      bounces
      onScroll={onScroll}
      scrollEventThrottle={1}
    >
      <StretchableImage
        isblur={refreshing}
        scrollY={scrollY}
        url={currentAccount?.header}
        imageHeight={IMAGEHEIGHT}
      />
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.title}>
            <TouchableOpacity onPress={handleToTest} style={styles.avatar}>
              <Avatar
                url={currentAccount?.avatar}
                size={65}
                borderColor="#fff"
                borderWidth={4}
              />
            </TouchableOpacity>
          </View>
          <View>
            <LineItemName
              displayname={
                currentAccount?.display_name || currentAccount?.username
              }
              fontSize={18}
            />
            <Text style={styles.acct}>
              <Text>@</Text>
              {currentAccount?.acct}
            </Text>
          </View>
          <HTMLContent html={replaceContentEmoji(currentAccount?.note)} />
          <View style={styles.act}>
            <View style={styles.actItem}>
              <Text style={styles.msg_number}>
                {StringUtil.stringAddComma(currentAccount?.statuses_count)}
              </Text>
              <Text style={styles.msg}>嘟文</Text>
            </View>
            <TouchableOpacity
              style={styles.actItem}
              onPress={handleNavigateToFollowing}
            >
              <Text style={styles.msg_number}>
                {StringUtil.stringAddComma(currentAccount?.following_count)}
              </Text>
              <Text style={styles.msg}>关注</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actItem}
              onPress={handleNavigateToFans}
            >
              <Text style={styles.msg_number}>
                {StringUtil.stringAddComma(currentAccount?.followers_count)}
              </Text>
              <Text style={styles.msg}>粉丝</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <SpacingBox
        width={Screen.width}
        height={10}
        color={Colors.pageDefaultBackground}
      />
      <ListRow
        leftIcon={
          <Icon name="like" size={23} color={Colors.commonToolBarText} />
        }
        title="喜欢"
        onPress={() => {
          navigate("Favourites");
        }}
      />
      <ListRow
        leftIcon={
          <Icon name="like" size={23} color={Colors.commonToolBarText} />
        }
        title="退出"
        onPress={() => {
          // navigate('Favourites');
          StorageUtil.clear();
        }}
      />
      {/* <PullLoading
        scrollY={scrollY}
        refreshing={refreshing}
        top={IMAGEHEIGHT / 2}
        left={Screen.width / 2}
        offsetY={PULLOFFSETY}
      /> */}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
  header: {
    backgroundColor: Colors.defaultWhite,
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
    marginVertical: 10,
    justifyContent: "space-around",
  },
  actItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  acct: {
    fontSize: 14,
    color: Colors.grayTextColor,
    marginTop: 5,
  },
  msg_number: {
    fontWeight: "bold",
    fontSize: 16,
  },
  msg: {
    fontWeight: "normal",
    color: Colors.grayTextColor,
    marginTop: 5,
  },
});
export default Setting;
