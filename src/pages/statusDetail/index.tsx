import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors, Screen } from "../../config";
import { getStatusesById } from "../../server/status";
import { useRequest } from "../../utils";
import HomeLineItem from "../home/homelineItem";
import ToolBar from "../home/toolBar";
import { RouterProps } from "../index";

const fetchStatusesById = (id: string) => {
  const fn = () => {
    return getStatusesById(id);
  };
  return fn;
};

interface StatusDetailProps extends RouterProps<"StatusDetail"> {}

const StatusDetail: React.FC<StatusDetailProps> = (props) => {
  const { id } = props?.route?.params;
  const inset = useSafeAreaInsets();

  const { data: statusDetail } = useRequest(fetchStatusesById(id), {
    manual: false,
    loading: true,
  });

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
