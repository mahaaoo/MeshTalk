import { RefreshList, Screen, Error } from "@components";
import UserItem from "@ui/fans/userItem";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";

import { Colors } from "../../config";
import { getFollowingById, unfollowById } from "../../server/account";
import useAccountStore from "../../store/useAccountStore";
import useI18nStore from "../../store/useI18nStore";
import { useRefreshList } from "../../utils/hooks";

interface UserFollowProps {}

const UserFollow: React.FC<UserFollowProps> = (props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentAccount } = useAccountStore();
  const { i18n } = useI18nStore();

  const { dataSource, listStatus, onLoadMore, onRefresh, err } = useRefreshList(
    (params) => getFollowingById(id, params),
    "Link",
    40,
  );

  useEffect(() => {
    onRefresh();
  }, []);

  const handleUnFollow = async (userId: string) => {
    if (currentAccount?.id === id) {
      const { data, ok } = await unfollowById(userId);
      if (data && ok) {
        console.log("取消关注成功");
      }
    }
  };

  return (
    <Screen headerShown title={i18n.t("page_title_following")}>
      {err ? (
        <View
          style={{
            flex: 1,
            backgroundColor: Colors.defaultWhite,
            alignItems: "center",
          }}
        >
          <Error type="NoData" style={{ marginTop: 200 }} />
          <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
            {i18n.t("page_title_following_null")}
          </Text>
        </View>
      ) : (
        <View style={styles.main}>
          <RefreshList
            data={dataSource}
            renderItem={({ item }) => (
              <UserItem
                item={item}
                showButton={currentAccount?.id === id}
                buttonOption={{
                  onPress: () => handleUnFollow(item.id),
                  title: "取消关注",
                }}
              />
            )}
            scrollEventThrottle={1}
            refreshState={listStatus}
            onRefresh={onRefresh}
            onFooterRefresh={onLoadMore}
          />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});

export default UserFollow;
