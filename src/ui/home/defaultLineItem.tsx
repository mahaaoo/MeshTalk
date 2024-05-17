import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ViewStyle,
} from "react-native";

import { RefreshState, Skeleton } from "../../components";
import useDeviceStore from "../../store/useDeviceStore";

interface DefaultLineItemProps {
  listStatus?: RefreshState;
  onRefresh?: () => void;
  style?: ViewStyle;
  scrollEnabled?: boolean;
}

const DefaultLineItem: React.FC<DefaultLineItemProps> = (props) => {
  const { listStatus, onRefresh, style, scrollEnabled = true } = props;

  return (
    <ScrollView
      scrollEnabled={scrollEnabled}
      refreshControl={
        <RefreshControl
          refreshing={listStatus === RefreshState.HeaderRefreshing}
          onRefresh={onRefresh}
        />
      }
      style={style}
    >
      {new Array(6).fill(0).map((_, index) => {
        const marginTop = index > 0 ? 10 : 0;
        return (
          <View key={index} style={[styles.container, { marginTop }]}>
            <Skeleton.SkeletonContainer
              childAnimation={Skeleton.Breath}
              reverse
            >
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
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  head: {
    flexDirection: "row",
  },
  avatarContainer: {
    flexDirection: "row",
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

export default DefaultLineItem;
