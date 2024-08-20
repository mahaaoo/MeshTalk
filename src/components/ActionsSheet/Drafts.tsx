import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

import useDeviceStore from "../../store/useDeviceStore";
import SplitLine from "../SplitLine";
import usePublishStore, { NewStatusParams } from "../../store/usePublishStore";
import OptionSheet from "./OptionSheet";

interface DraftsComponentProps {
  onSelect: (draft: NewStatusParams) => void;
  onClose: () => void;
}

const DraftsComponent: React.FC<DraftsComponentProps> = (props) => {
  const { onSelect } = props;
  const { drafts } = usePublishStore();
  const { width } = useDeviceStore();

  return (
    <>
      {drafts.map((draft) => {
        return (
          <View key={draft.timestamp}>
            <TouchableOpacity
              onPress={() => onSelect(draft)}
              style={styles.sigleDraft}
            >
              <Text>{draft.status}</Text>
            </TouchableOpacity>
            <SplitLine start={0} end={width - 40} />
          </View>
        );
      })}
    </>
  );
};

const Drafts = {
  show: (params: DraftsComponentProps) => {
    const { onClose } = params;
    OptionSheet.show({
      onClose,
      title: "new_status_draft_text",
      needCancle: true,
      items: <DraftsComponent {...params} />,
    });
  },
  hide: OptionSheet.hide,
};

const styles = StyleSheet.create({
  sigleDraft: {
    height: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
});

export default Drafts;
