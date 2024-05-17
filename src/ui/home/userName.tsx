import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

import { Emoji } from "../../config/interface";
import { replaceNameEmoji } from "../../utils";

interface UserNameProps {
  displayname: string;
  fontSize?: number;
  emojis: Emoji[];
  style?: TextStyle;
}

const UserName: React.FC<UserNameProps> = (props) => {
  const { displayname, fontSize = 16, emojis, style } = props;

  const name = useMemo(() => {
    return replaceNameEmoji(displayname, emojis);
  }, [displayname, emojis]);

  return (
    <>
      {name.map((item, index) => {
        return !item.image ? (
          <Text
            style={[styles.text, { fontSize }, style]}
            key={`HomeUserName${index}`}
          >
            {item.text}
          </Text>
        ) : (
          <Image
            key={`HomeUserName${index}`}
            style={styles.image}
            source={{
              uri: item.text,
            }}
            contentFit="cover"
          />
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
  },
  image: {
    width: 20,
    height: 20,
  },
});

export default UserName;
