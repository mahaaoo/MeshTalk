import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Text, StyleSheet, View } from "react-native";

import { Emoji } from "../../config/interface";
import { replaceNameEmoji } from "../../utils";

interface LineItemNameProps {
  displayname: string;
  fontSize?: number;
  emojis: Emoji[];
}

const LineItemName: React.FC<LineItemNameProps> = (props) => {
  const { displayname, fontSize = 16, emojis } = props;

  const name = useMemo(() => {
    return replaceNameEmoji(displayname, emojis);
  }, [displayname, emojis]);

  return (
    <View style={styles.main}>
      {name.map((item, index) => {
        return !item.image ? (
          <Text
            style={[styles.text, { fontSize }]}
            key={`HomeLineItemName${index}`}
          >
            {item.text}
          </Text>
        ) : (
          <Image
            key={`HomeLineItemName${index}`}
            style={styles.image}
            source={{
              uri: item.text,
            }}
            contentFit="cover"
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
  image: {
    width: 20,
    height: 20,
  },
});

export default LineItemName;
