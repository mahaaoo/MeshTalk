import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import useDeviceStore from "../../store/useDeviceStore";
import useEmojiStore from "../../store/useEmojiStore";

interface EmojiDisplayProps {
  onPressEmoji: (emoji: string) => void;
  emojiHeight: SharedValue<number>;
}

const EmojiDisplay: React.FC<EmojiDisplayProps> = (props) => {
  const { onPressEmoji, emojiHeight } = props;
  const { emojis, initEmoji } = useEmojiStore();
  const { insets, width } = useDeviceStore();

  useEffect(() => {
    initEmoji();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: Math.max(emojiHeight.value - insets.bottom, 0),
    };
  }, []);

  return (
    <Animated.View
      style={[styles.flatlist, { bottom: insets.bottom }, animatedStyle]}
    >
      <FlatList
        horizontal={false}
        numColumns={7}
        data={emojis}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onPressEmoji(`:${item.shortcode}:`);
              }}
            >
              <Image
                key={item.shortcode}
                style={[
                  {
                    width: (width - 80) / 7,
                    height: (width - 80) / 7,
                  },
                  styles.emojiItem,
                ]}
                source={{
                  uri: item.url,
                }}
                contentFit="cover"
              />
            </TouchableOpacity>
          );
        }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatlist: {
    position: "absolute",
    width: useDeviceStore.getState().width,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  emojiItem: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
});

export default EmojiDisplay;
