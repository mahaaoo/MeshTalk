import React, {useRef, useEffect, useCallback, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
// @ts-ignore
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  MyTabBar,
  Avatar,
  StickyHeader,
  StretchableImage,
  PullLoading,
  SlideHeader,
  FollowButton,
  Icon,
  HTMLContent,
} from '../../components';
import {Screen, Colors} from '../../config';
import {
  StringUtil,
  useRequest,
  goBack,
  replaceContentEmoji,
  navigate,
} from '../../utils';
import {
  getAccountsById,
  getStatusesById,
  getStatusesReplyById,
  getStatusesMediaById,
  getStatusesPinById,
  getRelationships,
} from '../../server/account';
import LineItemName from '../home/LineItemName';
import UseLine from './userLine';
import {RouterProps} from '../index';

const fetchUserById = (id: string = '') => {
  const fn = () => {
    return getAccountsById(id);
  };
  return fn;
};

const fetchRelationships = (id: string) => {
  const fn = () => {
    return getRelationships(id);
  };
  return fn;
};

interface UserProps extends RouterProps<'User'> {}

const IMAGEHEIGHT = 150; // 顶部下拉放大图片的高度
const HEADERHEIGHT = 104; // 上滑逐渐显示的Header的高度
const PULLOFFSETY = 100; // 下拉刷新的触发距离

const User: React.FC<UserProps> = props => {
  const scrollY: any = useRef(new Animated.Value(0)).current; //最外层ScrollView的滑动距离
  const {id} = props?.route?.params;

  const inset = useSafeAreaInsets();
  const {data: userData, run: getUserData} = useRequest(fetchUserById(id), {
    manual: true,
    loading: true,
  }); // 获取用户的个人信息
  const {data: relationship, run: getRelationship} = useRequest(
    fetchRelationships(id),
    {
      manual: true,
      loading: false,
    },
  ); // 获取用户的个人信息

  const [headHeight, setHeadHeight] = useState(0); // 为StickyHead计算顶吸到顶端的距离
  const [refreshing, setRefreshing] = useState(false); // 是否处于下拉加载的状态
  const [enableScrollViewScroll, setEnableScrollViewScroll] = useState(true); // 最外层ScrollView是否可以滚动

  useEffect(() => {
    getUserData();
    getRelationship();
  }, []);

  // 返回上一页
  const handleBack = useCallback(goBack, []);
  // 设置顶吸组件所在位置
  const handleOnLayout = (e: any) => {
    const {height} = e.nativeEvent.layout;
    setHeadHeight(height + IMAGEHEIGHT - HEADERHEIGHT);
  };
  // 监听当前滚动位置
  const handleListener = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    // 下拉刷新
    if (offsetY <= -PULLOFFSETY && !refreshing) {
      setRefreshing(true);
    }
    if (offsetY >= headHeight && enableScrollViewScroll) {
      setEnableScrollViewScroll(false);
    }
    return null;
  };

  // 当嵌套在里面内容滑动到顶端，将外层的ScrollView设置为可滑动状态
  const handleSlide = useCallback(() => {
    setEnableScrollViewScroll(true);
  }, []);

  const handleFinish = useCallback(() => {
    setRefreshing(false);
  }, []);

  const handleNavigateToFans = useCallback(() => {
    navigate('UserFans', {id: id});
  }, []);

  const handleNavigateToFollowing = useCallback(() => {
    navigate('UserFollow', {id: id});
  }, []);

  return (
    <>
      <Animated.ScrollView
        style={styles.container}
        bounces={true}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true, listener: handleListener},
        )}
        scrollEventThrottle={1}
        scrollEnabled={enableScrollViewScroll}
        showsVerticalScrollIndicator={false}>
        <StretchableImage
          isblur={refreshing}
          scrollY={scrollY}
          url={userData?.header}
          imageHeight={IMAGEHEIGHT}
        />
        <View style={styles.header} onLayout={handleOnLayout}>
          <View style={styles.avatarContainer}>
            <View style={styles.title}>
              <View style={styles.avatar}>
                <Avatar
                  url={userData?.avatar}
                  size={65}
                  borderColor={'#fff'}
                  borderWidth={4}
                />
              </View>
              <FollowButton relationships={relationship} id={id} />
            </View>
            <View>
              <LineItemName
                displayname={userData?.display_name}
                fontSize={18}
              />
              <Text style={styles.acct}>
                <Text>@</Text>
                {userData?.acct}
              </Text>
            </View>
            <HTMLContent html={replaceContentEmoji(userData?.note)} />
            <View style={styles.act}>
              <Text style={styles.msgNumber}>
                {StringUtil.stringAddComma(userData?.statuses_count)}
                <Text style={styles.msg}>&nbsp;嘟文</Text>
              </Text>
              <Text
                onPress={handleNavigateToFollowing}
                style={[styles.msgNumber, styles.msgLeft]}>
                {StringUtil.stringAddComma(userData?.following_count)}
                <Text style={styles.msg}>&nbsp;关注</Text>
              </Text>
              <Text
                onPress={handleNavigateToFans}
                style={[styles.msgNumber, styles.msgLeft]}>
                {StringUtil.stringAddComma(userData?.followers_count)}
                <Text style={styles.msg}>&nbsp;粉丝</Text>
              </Text>
            </View>
          </View>
        </View>
        {/* <StickyHeader
          stickyHeaderY={headHeight} // 把头部高度传入
          stickyScrollY={scrollY} // 把滑动距离传入
        >
          <ScrollableTabView
            style={styles.headerTab}
            renderTabBar={() => <MyTabBar style={styles.tabBar} />}>
            <UseLine
              tabLabel="嘟文"
              scrollEnabled={!enableScrollViewScroll}
              onTop={handleSlide}
              id={id}
              refreshing={refreshing}
              onFinish={handleFinish}
              request={getStatusesById}
            />
            <UseLine
              tabLabel="嘟文和回复"
              scrollEnabled={!enableScrollViewScroll}
              onTop={handleSlide}
              id={id}
              refreshing={refreshing}
              onFinish={handleFinish}
              request={getStatusesReplyById}
            />
            <UseLine
              tabLabel="已置顶"
              scrollEnabled={!enableScrollViewScroll}
              onTop={handleSlide}
              id={id}
              refreshing={refreshing}
              onFinish={handleFinish}
              request={getStatusesPinById}
            />
            <UseLine
              tabLabel="媒体"
              scrollEnabled={!enableScrollViewScroll}
              onTop={handleSlide}
              id={id}
              refreshing={refreshing}
              onFinish={handleFinish}
              request={getStatusesMediaById}
            />
          </ScrollableTabView>
        </StickyHeader> */}
      </Animated.ScrollView>
      <SlideHeader
        offsetY={IMAGEHEIGHT}
        scrollY={scrollY}
        height={HEADERHEIGHT}>
        <View style={[styles.slider, {marginTop: inset.top}]}>
          <LineItemName displayname={userData?.display_name} fontSize={18} />
        </View>
      </SlideHeader>
      <PullLoading
        scrollY={scrollY}
        refreshing={refreshing}
        top={IMAGEHEIGHT / 2}
        left={Screen.width / 2}
        offsetY={PULLOFFSETY}
      />
      <TouchableOpacity
        style={[styles.back, {top: inset.top + 10}]}
        onPress={handleBack}>
        <Icon name="arrowLeft" color="#fff" size={18} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
  back: {
    position: 'absolute',
    left: 15,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  act: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  acct: {
    fontSize: 14,
    color: Colors.grayTextColor,
    marginTop: 5,
  },
  msgNumber: {
    fontWeight: 'bold',
  },
  msgLeft: {
    marginLeft: 10,
  },
  msg: {
    fontWeight: 'normal',
    color: Colors.grayTextColor,
  },
  headerTab: {
    backgroundColor: '#fff',
  },
  tabBar: {
    justifyContent: 'flex-start',
  },
  slider: {
    flexDirection: 'row',
  },
});

export default User;
