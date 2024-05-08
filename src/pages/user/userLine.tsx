import React from "react";
import { View, StyleSheet } from "react-native";

import { RefreshList } from "../../components";
import { Colors, Screen } from "../../config";
import { getStatusesById } from "../../server/status";
import { useRefreshList } from "../../utils/hooks";
import DefaultLineItem from "../home/defaultLineItem";
import HomeLineItem from "../home/timeLineItem";

interface UserLineProps {
  id: string;
}

const UserLine: React.FC<UserLineProps> = (props) => {
  const { id } = props;
  // const {} = useRefreshList((id) => getStatusesById(""));

  // const handleListener = (e: any) => {
  //   const offsetY = e.nativeEvent.contentOffset.y;
  //   if (offsetY < 1) {
  //     onTop && onTop();
  //     // 保证table滚到最上面
  //     table?.current?.scrollToOffset({ x: 0, y: 0, animated: true });
  //   }
  //   return null;
  // };

  return (
    <View style={styles.main}>
      {/* <RefreshList
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={styles.freshList}
        data={dataSource}
        renderItem={({ item }) => <HomeLineItem item={item} />}
        scrollEventThrottle={1}
        refreshState={listStatus}
        emptyComponent={<DefaultLineItem />}
        onFooterRefresh={handleLoadMore}
        keyExtractor={(item, index) => item?.id || index.toString()}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
    height: Screen.height - 104 - 50, // 上滑逐渐显示的Header的高度+ScrollableTabView高度
    width: Screen.width,
  },
  freshList: {
    flex: 1,
    width: Screen.width,
  },
});

export default UserLine;
