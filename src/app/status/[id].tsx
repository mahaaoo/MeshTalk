import { Screen } from "@components";
import StatusItem from "@ui/statusItem";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";

import { Colors } from "../../config";
import { getStatusesById, getStatusesContext } from "../../server/status";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import { arrayToTree, StatusCtxTree } from "@utils/array";
import { Loading } from "react-native-ma-modal";

interface StatusDetailProps {}

const StatusDetail: React.FC<StatusDetailProps> = (props) => {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const { insets } = useDeviceStore();
  const { i18n } = useI18nStore();
  const [ctxTree, setCtxTree] = useState<React.ReactNode>(null);

  useEffect(() => {
    const fetchStatus = async (id: string) => {
      Loading.show();
      const { data: statusData, ok: statusOK } = await getStatusesById(id);
      const { data: ctxData, ok: ctxOK } = await getStatusesContext(id);
      if ( statusData && statusOK ) {
        if ( ctxData && ctxOK ) {
          // 转成树结构
          const tree = arrayToTree(ctxData.descendants, statusData, 0);
          const list = dfsTree(tree);
          setCtxTree(list);
        } else {
          const node = {
            node: statusData,
            children: [],
            deep: 0,
          }    
          const list = dfsTree(node);
          setCtxTree(list);
        }
      } else {
        // request error
      }
      Loading.hide();
    };

    fetchStatus(id);
  }, [id]);

  const dfsTree = (ctxTree: StatusCtxTree) => {
    if (!ctxTree) return null;

    const statusItemList: Array<React.ReactNode> = [];
    const dfs = (treeNode: StatusCtxTree) => {
      if (!treeNode) return;
      statusItemList.push(<StatusItem key={treeNode.node.id} isReply={treeNode.deep > 0} item={treeNode.node} deep={treeNode.deep} canToDetail={treeNode.deep > 0} />)
      treeNode.children.forEach((tree) => {
        dfs(tree)
      });
    }

    dfs(ctxTree);
    return statusItemList.length === 0 ? null : statusItemList;
  };

  return (
    <Screen headerShown title={i18n.t("page_status_detail")}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom  }}>
        {ctxTree}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  toolBar: {
    position: "absolute",
    width: useDeviceStore.getState().width,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.defaultWhite,
  },
});

export default StatusDetail;
