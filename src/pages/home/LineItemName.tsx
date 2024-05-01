import { Image } from "expo-image";
import React, { useMemo } from "react";
import { Text, StyleSheet } from "react-native";

import { replaceNameEmoji } from "../../utils";

interface LineItemNameProps {
  displayname: string;
  fontSize?: number;
}

const LineItemName: React.FC<LineItemNameProps> = (props) => {
  const { displayname, fontSize = 16 } = props;

  const name = useMemo(() => {
    return replaceNameEmoji(displayname);
  }, [displayname]);

  return (
    <>
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
              uri: "https://s3.acg.mn/custom_emojis/images/000/015/346/original/7341c51dd3b97a42.png",
            }}
            resizeMode="cover"
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
    width: 15,
    height: 15,
  },
});

export default LineItemName;
