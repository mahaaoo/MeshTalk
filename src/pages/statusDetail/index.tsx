import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Screen } from "../../config";
import { Timelines } from "../../config/interface";
import { getStatusesById } from "../../server/status";
import HomeLineItem from "../home/timeLineItem";
import ToolBar from "../home/toolBar";
import { RouterProps } from "../index";

interface StatusDetailProps extends RouterProps<"StatusDetail"> {}

const StatusDetail: React.FC<StatusDetailProps> = (props) => {
  const { id } = props?.route?.params;
  const inset = useSafeAreaInsets();
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

  if (!statusDetail) {
    return null;
  }

  return (
    <>
      <HomeLineItem item={statusDetail} needToolbar={false} />
      <View style={[styles.toolBar, { height: 40 + inset.bottom }]}>
        <ToolBar />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  toolBar: {
    position: "absolute",
    width: Screen.width,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.defaultWhite,
  },
});

export default StatusDetail;
