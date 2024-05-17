import UserName from "@ui/home/userName";
import React from "react";
import { View, Text } from "react-native";

import { styles } from "./index.style";
import { Icon } from "../../components/Icon";
import { Colors } from "../../config";
import { Emoji } from "../../config/interface";

interface ReplyNameProps {
  displayName: string;
  emojis: Emoji[];
  type: string;
}

const ReplyName: React.FC<ReplyNameProps> = (props) => {
  const { displayName, emojis, type } = props;

  return (
    <View style={styles.status}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Icon name="turn" size={20} color={Colors.commonToolBarText} />
        <Text
          style={{ flexShrink: 2, marginLeft: 2 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          <UserName
            displayname={displayName}
            emojis={emojis}
            style={styles.turnText}
          />
        </Text>
        <Text style={styles.turnText}>{type}</Text>
      </View>
    </View>
  );
};

export default ReplyName;
