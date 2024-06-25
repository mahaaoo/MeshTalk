import { Button } from "@components";
import { dateLocale } from "@utils/date";
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
import useI18nStore from "../../store/useI18nStore";

interface AnnounceCardProps {
  announce: AnnouncementInterface;
  index: number;
  total: number;
}

const AnnounceCard: React.FC<AnnounceCardProps> = (props) => {
  const { announce, index, total } = props;
  const { width, insets } = useDeviceStore();
  const { i18n } = useI18nStore();

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
          <Text>{dateLocale(announce?.updated_at)}</Text>
          <Text>{`${index}/${total}`}</Text>
        </View>
        <HTMLContent
          mentions={announce.mentions}
          tags={announce.tags}
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
        text={i18n.t("announce_read_button_text")}
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
