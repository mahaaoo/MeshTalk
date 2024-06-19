import { Screen } from "@components";
import StatusItem from "@ui/statusItem";
import ToolBar from "@ui/statusItem/toolBar";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { Colors } from "../../config";
import { Timelines } from "../../config/interface";
import { getStatusesById } from "../../server/status";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";

interface StatusDetailProps {}

const StatusDetail: React.FC<StatusDetailProps> = (props) => {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const { insets } = useDeviceStore();
  const { i18n } = useI18nStore();
  const [statusDetail, setStatusDetail] = useState<Timelines>();

  useEffect(() => {
    const fetchStatus = async (id: string) => {
      const { data } = await getStatusesById(id);
      if (data) {
        setStatusDetail(data);
      }
    };

    fetchStatus(id);
  }, [id]);

  return (
    <Screen headerShown title={i18n.t("page_status_detail")}>
      {!statusDetail ? (
        <View />
      ) : (
        <>
          <StatusItem item={statusDetail} needToolbar={false} />
          <View style={[styles.toolBar, { height: 40 + insets.bottom }]}>
            <ToolBar item={statusDetail} />
          </View>
        </>
      )}
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
