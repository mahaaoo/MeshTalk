import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  ModalUtil,
  OpacityContainer,
  UniqueModal,
} from "react-native-ma-modal";

interface PopOptionsProps {}

const PopOptions: React.FC<PopOptionsProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text>屏蔽</Text>
      </View>
      <View style={styles.item}>
        <Text>提及</Text>
      </View>
      <View style={styles.item}>
        <Text>拉黑</Text>
      </View>
      <View style={styles.item}>
        <Text>举报</Text>
      </View>
    </View>
  );
};

export const PopOptonsUtil: UniqueModal = {
  key: "global-pop-options",
  template: (top: number, right: number) => {
    return (
      <OpacityContainer
        mask={false}
        containerStyle={{
          position: "absolute",
          top,
          right,
        }}
      >
        <PopOptions />
      </OpacityContainer>
    );
  },
  show: (top: number, right: number) => {
    ModalUtil.add(PopOptonsUtil.template(top, right), PopOptonsUtil.key);
  },
  hide: () => ModalUtil.remove(PopOptonsUtil.key || ""),
  isExist: () => ModalUtil.isExist(PopOptonsUtil.key || "") || false,
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    height: 4 * 50,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  item: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PopOptions;
