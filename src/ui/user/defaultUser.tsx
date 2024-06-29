import { Skeleton, Icon } from '@components';
import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import useDeviceStore from '../../store/useDeviceStore';
import { router } from 'expo-router';

interface DefaultUserProps {
};

const DefaultUser: React.FC<DefaultUserProps> = props => {
  const {} = props;
  const { insets } = useDeviceStore();

  const handleBack = useCallback(router.back, []);

  return (
    <>
      <View style={styles.main}>
        <Skeleton.SkeletonContainer
          childAnimation={Skeleton.Breath}
          reverse
        >
          <View style={{ height: 150 }} />
          <Skeleton.SkeletonRect style={styles.mainAvatar} />
          <Skeleton.SkeletonRect style={styles.userName} />
          <Skeleton.SkeletonRect style={styles.userId} />
          <Skeleton.SkeletonRect style={styles.userBio} />

          <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
            <Skeleton.SkeletonRect style={styles.tabItem} />
            <Skeleton.SkeletonRect style={styles.tabItem} />
            <Skeleton.SkeletonRect style={styles.tabItem} />
            <Skeleton.SkeletonRect style={styles.tabItem} />
          </View>

          <View style={styles.avatarContainer}>
            <Skeleton.SkeletonRect style={styles.avatar} />
            <View style={styles.nameContainer}>
              <Skeleton.SkeletonRect style={styles.name} />
              <Skeleton.SkeletonRect style={styles.nickName} />
            </View>
          </View>
          <View style={styles.content}>
            <Skeleton.SkeletonRect style={styles.contentText1} />
            <Skeleton.SkeletonRect style={styles.contentText2} />
            <Skeleton.SkeletonRect style={styles.contentText3} />
          </View>

          <View style={styles.avatarContainer}>
            <Skeleton.SkeletonRect style={styles.avatar} />
            <View style={styles.nameContainer}>
              <Skeleton.SkeletonRect style={styles.name} />
              <Skeleton.SkeletonRect style={styles.nickName} />
            </View>
          </View>
          <View style={styles.content}>
            <Skeleton.SkeletonRect style={styles.contentText1} />
            <Skeleton.SkeletonRect style={styles.contentText2} />
            <Skeleton.SkeletonRect style={styles.contentText3} />
          </View>

          <View style={styles.avatarContainer}>
            <Skeleton.SkeletonRect style={styles.avatar} />
            <View style={styles.nameContainer}>
              <Skeleton.SkeletonRect style={styles.name} />
              <Skeleton.SkeletonRect style={styles.nickName} />
            </View>
          </View>
          <View style={styles.content}>
            <Skeleton.SkeletonRect style={styles.contentText1} />
            <Skeleton.SkeletonRect style={styles.contentText2} />
            <Skeleton.SkeletonRect style={styles.contentText3} />
          </View>
        </Skeleton.SkeletonContainer>
      </View>
      <TouchableOpacity
        style={[styles.back, { top: insets.top + 10 }]}
        onPress={handleBack}
      >
        <Icon name="arrowLeft" color="#fff" size={18} />
      </TouchableOpacity>
    </>
  )
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginHorizontal: 15,
  },
  back: {
    position: "absolute",
    left: 15,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  mainAvatar: {
    height: 65,
    width: 65,
    marginTop: -20,
  },
  userName: {
    height: 20,
    width: 80,
    marginTop: 5,
  },
  userId: {
    height: 20,
    width: 140,
    marginTop: 5,
  },
  userBio: {
    height: 60,
    width: useDeviceStore.getState().width - 30,
    marginTop: 10,
  },
  tabItem: {
    height: 40,
    width: useDeviceStore.getState().width / 5,
  },
  avatarContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  content: {
    marginVertical: 5,
  },
  avatar: {
    height: 45,
    width: 45,
  },
  nameContainer: {
    marginLeft: 15,
    justifyContent: "space-between",
  },
  name: {
    height: 20,
    width: 220,
  },
  nickName: {
    height: 20,
    width: 120,
  },
  contentText1: {
    height: 30,
    width: useDeviceStore.getState().width - 30,
  },
  contentText2: {
    height: 30,
    width: useDeviceStore.getState().width - 130,
    marginTop: 5,
  },
  contentText3: {
    height: 30,
    width: useDeviceStore.getState().width - 250,
    marginTop: 5,
  },
});

export default DefaultUser;
