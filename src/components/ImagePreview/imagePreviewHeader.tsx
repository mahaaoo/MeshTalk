import React, { useState } from "react";
import { TouchableOpacity, View, Text, Share } from "react-native";
import { Loading, ModalUtil } from "react-native-ma-modal";
import {
  useAnimatedReaction,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";

import { Icon } from "../Icon";
import ActionsSheet from "../ActionsSheet";

interface ImagePreviewHeaderProps {
  currentIndex: SharedValue<number>;
  total: number;
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  url: string;
}

const ImagePreviewHeader: React.FC<ImagePreviewHeaderProps> = (props) => {
  const { currentIndex, total, url } = props;

  const [index, setIndex] = useState(currentIndex.value);

  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      runOnJS(setIndex)(value + 1);
    },
  );

  const onShare = async () => {
    ActionsSheet.PicMore.show({
      onClose: () => {},
      onSelect: () => {},
    });
    // try {
    //   const result = await Share.share({
    //     url,
    //   });
    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //     } else {
    //       // shared
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    // } catch (error: any) {
    //   // Alert.alert(error.message);
    //   console.log(error.message);
    // }
  };

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 88,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 55,
        paddingHorizontal: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          ModalUtil.remove("global-image-preview");
        }}
      >
        <Icon name="close" color="white" />
      </TouchableOpacity>
      <Text style={{ color: "white", fontSize: 15 }}>
        {index + "/" + total}
      </Text>
      <TouchableOpacity onPress={onShare}>
        <Icon name="three_point" color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ImagePreviewHeader;
