import { Button } from "@components";
import { dateToFromNow } from "@utils/date";
import { replaceContentEmoji } from "@utils/emoji";
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Toast } from "react-native-ma-modal";

import Reaction from "./reaction";
import HTMLContent from "../../components/HTMLContent";
import { Colors } from "../../config";
import { AnnouncementInterface } from "../../config/interface";
import { dismissAnnounce } from "../../server/notifications";
import useDeviceStore from "../../store/useDeviceStore";

interface AnnounceCardProps {
  announce: AnnouncementInterface;
  index: number;
  total: number;
}

const AnnounceCard: React.FC<AnnounceCardProps> = (props) => {
  const { announce, index, total } = props;
  const { width, insets } = useDeviceStore();
  const [read, setRead] = useState(announce.read);

  const handleRead = async () => {
    if (read) return;
    setRead(true);
    const { ok } = await dismissAnnounce(announce.id);
    if (!ok) {
      setRead(false);
      Toast.show("已读失败");
    }
  };

  return (
    <ScrollView style={{ width, flex: 1 }}>
      <View style={styles.item}>
        <View style={styles.time}>
          <Text>发布于：{dateToFromNow(announce?.updated_at)}</Text>
          <Text>{`${index}/${total}`}</Text>
        </View>
        <HTMLContent
          html={replaceContentEmoji(announce.content, announce.emojis)}
        />
        <View style={styles.reactionsContainer}>
          {announce.reactions.length > 0 &&
            announce.reactions?.map((reaction) => {
              return (
                <Reaction
                  key={reaction.name}
                  announceId={announce.id}
                  reaction={reaction}
                />
              );
            })}
        </View>
      </View>
      <Button
        style={{
          marginHorizontal: 15,
          marginBottom: insets.bottom,
          backgroundColor: read ? Colors.defaultLineGreyColor : Colors.theme,
        }}
        text="已读"
        onPress={handleRead}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  time: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginVertical: 25,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  reactionsContainer: {
    marginVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default AnnounceCard;
