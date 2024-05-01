import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { Skeleton } from "../../components";
import { Screen } from "../../config";

const DefaultLineItem: React.FC<object> = () => {
  return (
    <ScrollView>
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
    width: Screen.width - 30,
  },
  contentText2: {
    height: 30,
    width: Screen.width - 130,
    marginTop: 5,
  },
  contentText3: {
    height: 30,
    width: Screen.width - 250,
    marginTop: 5,
  },
});

export default DefaultLineItem;
