import {
  Button,
  Avatar,
  SplitLine,
  ActionsSheet,
  Icon,
  Screen,
} from "@components";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Text,
  TextInput,
  Animated,
  Keyboard,
  Easing,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

import { Colors } from "../config";
import useAccountStore from "../store/useAccountStore";
import useDeviceStore from "../store/useDeviceStore";
import useEmojiStore from "../store/useEmojiStore";
import usePublishStore from "../store/usePublishStore";

interface PublishProps {}

const Publish: React.FC<PublishProps> = () => {
  const navigation = useNavigation();
  const accountStore = useAccountStore();
  const { emojis, initEmoji } = useEmojiStore();
  const { postNewStatuses, statusContent, inputContent } = usePublishStore();

  const [reply, setReply] = useState("任何人可以回复");
  const { insets, width } = useDeviceStore();

  const offsetY: any = useRef(new Animated.Value(insets.bottom)).current;
  const InputRef: any = useRef();

  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", keyboardWillShow);
    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            router.back();
          }}
        >
          <Text style={{ fontSize: 18, marginLeft: 15, color: Colors.theme }}>
            取消
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Button
          style={styles.header}
          textStyle={styles.header_text}
          text="发送"
          onPress={() => {
            postNewStatuses({
              status: statusContent,
            });
          }}
        />
      ),
    });
  }, [statusContent]);

  const keyboardWillShow = useCallback((e: any) => {
    Animated.timing(offsetY, {
      toValue: e.endCoordinates.height,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start(() => {
      setScrollHeight(e.endCoordinates.height - insets.bottom);
    });
  }, []);

  const handleClickEmojis = useCallback(() => {
    initEmoji();
    Keyboard.dismiss();
  }, []);

  const handleClickPic = useCallback(() => {
    InputRef && InputRef?.current?.focus();
  }, []);

  return (
    <Screen>
      <View style={styles.main}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Avatar url={accountStore.currentAccount?.avatar} />
          </View>
          <TextInput
            ref={InputRef}
            autoFocus
            style={styles.input}
            textAlignVertical="top"
            multiline
            numberOfLines={4}
            placeholder="有什么新鲜事"
            underlineColorAndroid="transparent"
            value={statusContent}
            onChangeText={inputContent}
          />
        </View>
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.tool, { bottom: offsetY }]}>
            <View style={styles.toolBar}>
              <TouchableOpacity
                style={styles.power}
                onPress={() => {
                  handleClickEmojis();
                  ActionsSheet.show({
                    onSelect: (text: string) => {
                      setReply(text);
                      ActionsSheet.hide();
                    },
                    onClose: () => {
                      handleClickPic();
                    },
                    bottom: insets.bottom,
                  });
                }}
              >
                <Image
                  source={require("../images/erath.png")}
                  style={styles.iconErath}
                />
                <Text style={styles.replayText}>{reply}</Text>
              </TouchableOpacity>
              <SplitLine start={0} end={width} />
            </View>
            <View style={styles.iconContainer}>
              <View style={styles.iconView}>
                <TouchableOpacity
                  style={styles.iconTouch}
                  onPress={handleClickPic}
                >
                  <Icon name="photo" size={33} color={Colors.theme} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconTouch}>
                  <Icon name="chart" size={33} color={Colors.theme} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconTouch}>
                  <Icon name="warning" size={33} color={Colors.theme} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconTouch}>
                  <Icon name="time" size={30} color={Colors.theme} />
                </TouchableOpacity>
              </View>
              <View style={styles.currentContent}>
                <CounterContent />
                <View style={styles.emojiContainer} />
                <TouchableOpacity
                  style={styles.emojiTouch}
                  onPress={handleClickEmojis}
                >
                  <Icon name="emoji" size={33} color={Colors.theme} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          <View
            style={[
              styles.flatlist,
              { height: scrollHeight, bottom: insets.bottom },
            ]}
          >
            <FlatList
              horizontal={false}
              numColumns={7}
              data={emojis}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      inputContent(statusContent + `:${item.shortcode}:`);
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
          </View>
        </View>
      </View>
    </Screen>
  );
};

// 输入内容长度计数，需要额外拿出来
const CounterContent = () => {
  const { statusContent } = usePublishStore();
  return <Text style={styles.currentContentText}>{statusContent.length}</Text>;
};

export default Publish;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.defaultWhite,
    width: useDeviceStore.getState().width,
  },
  header: {
    paddingVertical: 0,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
  },
  header_text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tool: {
    width: useDeviceStore.getState().width,
    backgroundColor: "#fff",
    position: "absolute",
  },
  input: {
    flex: 1,
    height: useDeviceStore.getState().width / 3,
    fontSize: 18,
    marginHorizontal: 10,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  flatlist: {
    position: "absolute",
    width: useDeviceStore.getState().width,
    overflow: "hidden",
  },
  power: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  container: {
    flexDirection: "row",
  },
  avatarContainer: {
    marginLeft: 10,
    marginTop: 10,
  },
  contentContainer: {
    width: useDeviceStore.getState().width,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
  },
  toolBar: {
    width: useDeviceStore.getState().width,
    height: 50,
  },
  iconErath: {
    width: 20,
    height: 20,
  },
  replayText: {
    color: Colors.theme,
    fontSize: 14,
    marginLeft: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  iconView: {
    flexDirection: "row",
  },
  iconTouch: {
    marginLeft: 20,
  },
  currentContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentContentText: {
    fontSize: 16,
    color: Colors.theme,
  },
  emojiContainer: {
    width: 1,
    height: 30,
    backgroundColor: Colors.defaultLineGreyColor,
    marginHorizontal: 15,
  },
  emojiTouch: {
    marginRight: 15,
  },
  emojiItem: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
});
