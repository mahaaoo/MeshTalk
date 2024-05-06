import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
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
  Animated,
  Keyboard,
  Easing,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { styles } from "./index.style";
import {
  Button,
  Avatar,
  SplitLine,
  ActionsSheet,
  Icon,
} from "../../components";
import { Colors, Screen } from "../../config";
import { getInstanceEmojis } from "../../server/app";
import { postNewStatuses } from "../../server/status";
import useAccountStore from "../../store/useAccountStore";
import useEmojiStore from "../../store/useEmojiStore";
import { goBack, useRequest } from "../../utils";

const fetchEmojis = () => {
  const fn = () => {
    return getInstanceEmojis();
  };
  return fn;
};

const fetchNewStatuses = () => {
  const fn = (params: object) => {
    return postNewStatuses(params);
  };
  return fn;
};

interface PublishProps {}

const Publish: React.FC<PublishProps> = () => {
  const navigation = useNavigation();
  const accountStore = useAccountStore();
  const { emojis, initEmoji } = useEmojiStore();

  const [reply, setReply] = useState("任何人可以回复");
  const inset = useSafeAreaInsets();

  const { data, run: postNewStatuses } = useRequest(fetchNewStatuses(), {
    manual: true,
    loading: true,
  });

  const offsetY: any = useRef(new Animated.Value(inset.bottom)).current;
  const InputRef: any = useRef();

  const [scrollHeight, setScrollHeight] = useState(0);
  const [content, setContent] = useState<string>("");

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
            goBack();
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
              status: content,
            });
            Keyboard.dismiss();
          }}
        />
      ),
    });
  }, [content]);

  const keyboardWillShow = useCallback((e: any) => {
    Animated.timing(offsetY, {
      toValue: e.endCoordinates.height,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start(() => {
      setScrollHeight(e.endCoordinates.height - inset.bottom);
    });
  }, []);

  const handleClickEmojis = useCallback(() => {
    initEmoji();
    Keyboard.dismiss();
  }, []);

  const handleClickPic = useCallback(() => {
    InputRef && InputRef?.current?.focus();
  }, []);

  const currentContentSize = content.length;

  return (
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
          value={content}
          onChangeText={(text) => {
            setContent(text);
          }}
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
                  bottom: inset.bottom,
                });
              }}
            >
              <Image
                source={require("../../images/erath.png")}
                style={styles.iconErath}
              />
              <Text style={styles.replayText}>{reply}</Text>
            </TouchableOpacity>
            <SplitLine start={0} end={Screen.width} />
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
              <Text style={styles.currentContentText}>
                {currentContentSize}
              </Text>
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
            { height: scrollHeight, bottom: inset.bottom },
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
                    setContent(
                      (preContent: string) =>
                        (preContent = preContent + `:${item.shortcode}:`),
                    );
                  }}
                >
                  <Image
                    key={item.shortcode}
                    style={[
                      {
                        width: (Screen.width - 80) / 7,
                        height: (Screen.width - 80) / 7,
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
  );
};

export default Publish;
