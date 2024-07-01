import {
  Button,
  Avatar,
  SplitLine,
  ActionsSheet,
  Icon,
  Screen,
} from "@components";
import EmojiDisplay from "@ui/publish/emojiDisplay";
import MediaDisplay from "@ui/publish/mediaDisplay";
import { imageOriginPick } from "@utils/media";
import { ImagePickerAsset } from "expo-image-picker";
import { router, useNavigation } from "expo-router";
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Text,
  TextInput,
  Keyboard,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "../config";
import useAccountStore from "../store/useAccountStore";
import useDeviceStore from "../store/useDeviceStore";
import useI18nStore from "../store/useI18nStore";
import usePublishStore from "../store/usePublishStore";

interface PublishProps {}

const Publish: React.FC<PublishProps> = () => {
  const navigation = useNavigation();
  const accountStore = useAccountStore();
  const { postNewStatuses } = usePublishStore();
  const { i18n } = useI18nStore();

  const [isWarn, setIsWarn] = useState(false);
  const [mediaList, setMediaList] = useState<ImagePickerAsset[]>([]);
  const [statusContent, setStatusContent] = useState("");
  const [spoilerText, setSpoilerText] = useState("");

  const { insets, width } = useDeviceStore();
  const offsetY = useSharedValue(insets.bottom);

  const pressEmoji = useSharedValue(false);
  const InputRef: any = useRef();

  const replyObj = useMemo(
    () => [
      {
        title: i18n.t("new_status_ares_public"),
        key: "public",
        icon: "unlock",
      },
      {
        title: i18n.t("new_status_ares_unlist"),
        key: "unlisted",
        icon: "replyLock",
      },
      {
        title: i18n.t("new_status_ares_follow_only"),
        key: "private",
        icon: "replyFollow",
      },
      {
        title: i18n.t("new_status_ares_direct"),
        key: "direct",
        icon: "replyAite",
      },
    ],
    [i18n],
  );

  const [reply, setReply] = useState(replyObj[0]);

  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", keyboardWillShow);
    Keyboard.addListener("keyboardWillHide", keyboardWillHide);

    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
    };
  }, []);

  const newStatusParams = useMemo(
    () => ({
      mediaList,
      sensitive: isWarn,
      reply: reply.key,
      status: statusContent,
      spoiler_text: spoilerText,
    }),
    [mediaList, isWarn, reply, statusContent, spoilerText],
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            router.back();
          }}
        >
          <Text style={{ fontSize: 18, color: Colors.theme }}>
            {i18n.t("new_status_goback_title")}
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <Button
          style={styles.header}
          textStyle={styles.header_text}
          text={i18n.t("new_status_header_submit")}
          onPress={() => {
            postNewStatuses(newStatusParams);
          }}
        />
      ),
    });
  }, [newStatusParams, i18n, navigation, postNewStatuses]);

  const keyboardWillShow = useCallback((e: any) => {
    offsetY.value = withTiming(e.endCoordinates.height, { duration: 250 });
  }, []);

  const keyboardWillHide = useCallback(() => {
    if (!pressEmoji.value) {
      offsetY.value = withTiming(insets.bottom, { duration: 250 });
    }
  }, []);

  const handleClickEmojis = useCallback(() => {
    pressEmoji.value = !pressEmoji.value;
    Keyboard.dismiss();
    const offset = pressEmoji.value ? insets.bottom : 280;
    offsetY.value = withTiming(offset, { duration: 250 });
  }, [insets, offsetY, pressEmoji]);

  const handleClickPic = useCallback(async () => {
    const { ok, fileInfo } = await imageOriginPick();
    if (ok && fileInfo) {
      const newMediaList = [...mediaList];
      newMediaList.unshift(fileInfo!);
      setMediaList(newMediaList);
    }
  }, [mediaList]);

  const handleReply = () => {
    Keyboard.dismiss();
    ActionsSheet.Reply.show({
      params: replyObj as never,
      onSelect: (reply) => {
        setReply(reply);
        ActionsSheet.Reply.hide();
      },
      onClose: () => {
        InputRef && InputRef?.current?.focus();
      },
    });
  };

  const deleteMedia = (index: number) => {
    const newMediaList = [...mediaList];
    newMediaList.splice(index, 1);
    setMediaList(newMediaList);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: offsetY.value,
    };
  });

  return (
    <Screen headerShown title={i18n.t("new_status_header_title")}>
      <View style={styles.main}>
        <ScrollView>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.avatarContainer}>
              <Avatar url={accountStore.currentAccount?.avatar} />
            </View>
            <View style={{ flex: 1, paddingRight: 20 }}>
              {isWarn ? (
                <TextInput
                  style={styles.warnInput}
                  placeholder={i18n.t("new_status_warning_placeholder")}
                  underlineColorAndroid="transparent"
                  value={spoilerText}
                  onChangeText={(text) => setSpoilerText(text)}
                />
              ) : null}
              <TextInput
                ref={InputRef}
                autoFocus
                style={styles.input}
                textAlignVertical="top"
                multiline
                numberOfLines={4}
                placeholder={i18n.t("new_status_content_placeholder")}
                underlineColorAndroid="transparent"
                value={statusContent}
                onChangeText={(text) => setStatusContent(text)}
              />
            </View>
          </View>
          <ScrollView
            contentContainerStyle={{ paddingLeft: 65 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {mediaList.length >= 0
              ? mediaList.map((media, index) => {
                  return (
                    <MediaDisplay
                      deleMedia={() => deleteMedia(index)}
                      media={media}
                      key={`${media.assetId}_${index}`}
                    />
                  );
                })
              : null}
          </ScrollView>
        </ScrollView>
        <View style={styles.contentContainer}>
          <Animated.View style={[styles.tool, animatedStyle]}>
            <View style={styles.toolBar}>
              <View style={styles.power}>
                <Text style={styles.replayText} onPress={handleReply}>
                  {reply.title}
                </Text>
              </View>
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
                <TouchableOpacity
                  style={styles.iconTouch}
                  onPress={() => {
                    setIsWarn((warn) => !warn);
                  }}
                >
                  <Icon
                    name="warning"
                    size={33}
                    color={isWarn ? "orange" : Colors.theme}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconTouch}>
                  <Icon name="time" size={30} color={Colors.theme} />
                </TouchableOpacity>
              </View>
              <View style={styles.currentContent}>
                <CounterContent statusContent={statusContent} />
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
          <EmojiDisplay
            onPressEmoji={(emoji) => {
              setStatusContent((status) => status + emoji);
            }}
            emojiHeight={offsetY}
          />
        </View>
      </View>
    </Screen>
  );
};

// 输入内容长度计数，需要额外拿出来
const CounterContent = (props: { statusContent: string }) => {
  const { statusContent } = props;
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
  warnInput: {
    width: "100%",
    fontSize: 18,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.defaultLineGreyColor,
  },
  power: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
});
