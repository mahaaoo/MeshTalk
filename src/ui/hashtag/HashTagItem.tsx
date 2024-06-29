import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HashTag } from "../../config/interface";
import { Icon, AccountChart, SplitLine } from "@components";
import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";
import useDeviceStore from "../../store/useDeviceStore";
import { router } from "expo-router";

interface HashTagItemProps {
  item: HashTag;
}

type i18nDescribe = (days: number, accounts: number, uses: number) => string;

const HashTagItem: React.FC<HashTagItemProps> = (props) => {
  const { item } = props;
  const { i18n } = useI18nStore();
  const { width } = useDeviceStore();

  const describe = useMemo(() => {
    const lastDays = item.history.length;
    let uses = 0;
    let accounts = 0;
    item.history.forEach((h) => {
      uses += parseInt(h.uses);
      accounts += parseInt(h.accounts);
    });
    const i18nDescribeFun = i18n.t("hash_tag_describe") as i18nDescribe;
    return i18nDescribeFun(lastDays, accounts, uses);
  }, [i18n, item]);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push({
          pathname: "/tag/[id]",
          params: {
            id: item.name,
          },
        });
      }}
    >
      <View key={item.url} style={styles.itemContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Icon name="hashTag" color="#333" />
          <View style={{ marginLeft: 5, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>
              {item.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: Colors.grayTextColor,
                marginTop: 5,
              }}
            >
              {describe}
            </Text>
          </View>
        </View>
        <AccountChart history={item.history} />
      </View>
      <SplitLine start={0} end={width} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },
});

export default HashTagItem;
