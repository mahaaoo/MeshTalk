import { Image } from "expo-image";
import React, { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { styles } from "./index.style";
import { Colors } from "../../config";
import { Card } from "../../config/interface";
import { openURL } from "@utils/media";

interface WebCardProps {
  card: Card;
}

const WebCard: React.FC<WebCardProps> = (props) => {
  const { card } = props;

  const handleNavigation = useCallback(() => {
    console.log("handleNavigation");
    openURL(card.url);
  }, [card]);

  if (!card || !card.image) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      style={styles.webCardContainer}
    >
      <Image
        style={styles.webCardImage}
        source={{
          uri: card?.image,
        }}
        contentFit="cover"
      />
      <View style={styles.webCardContent}>
        <View style={styles.webCardCardContainer}>
          <Text numberOfLines={1} style={styles.webCardCardText}>
            {card?.title}
          </Text>
        </View>
        <View style={styles.webCardDesContainer}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={3}
            style={styles.webCardDesText}
          >
            {card?.description}
          </Text>
        </View>
        <View style={styles.webCardUrlContainer}>
          <Text numberOfLines={1} style={{ color: Colors.grayTextColor }}>
            {card?.url}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WebCard;
