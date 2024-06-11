import { Avatar, Button, Icon, Screen, SplitLine } from "@components";
import { imagePick } from "@utils/media";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useReducer } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Switch,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { Loading, Toast } from "react-native-ma-modal";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "../../config";
import { AccountFields } from "../../config/interface";
import {
  reducer,
  initialState,
  getRequestBody,
} from "../../reducer/editInfoReducer";
import { verifyToken } from "../../server/app";
import { updateCredentials } from "../../server/status";
import useAccountStore from "../../store/useAccountStore";
import useDeviceStore from "../../store/useDeviceStore";

interface EditInfoProps {}

const EditInfo: React.FC<EditInfoProps> = (props) => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { width } = useDeviceStore();
  const offset = useSharedValue(0);
  const { setCurrentAccount } = useAccountStore();

  useEffect(() => {
    const fetchAccount = async () => {
      const { data, ok } = await verifyToken();
      if (ok && data) {
        dispatch({
          type: "init",
          payload: data,
        });
      }
    };
    fetchAccount();
  }, []);

  navigation.setOptions({
    headerRight: () => (
      <Button
        style={styles.header}
        textStyle={styles.headerText}
        text="重置"
        onPress={() => {
          Alert.alert("提示", "确定要重置内容？", [
            {
              text: "取消",
            },
            {
              text: "确定",
              onPress: () => {
                dispatch({
                  type: "init",
                  payload: state.account,
                });
              },
            },
          ]);
        }}
      />
    ),
  });

  const submit = async () => {
    Loading.show();
    const formData = getRequestBody(state);
    const { data, ok } = await updateCredentials(formData);
    if (ok && data) {
      Toast.show("保存成功");
      router.back();
      setCurrentAccount(data);
    }
    Loading.hide();
  };

  const pickAvatar = async () => {
    const { ok, uri, fileSize } = await imagePick();
    if (ok) {
      const isSizeOk = fileSize! / 1024 / 1024 < 2;
      if (!isSizeOk) {
        console.log("Avatar Image Size Must Under 2MB");
        return;
      }

      dispatch({
        type: "setItem",
        payload: {
          avatar: uri,
        },
      });
    }
  };

  const pickHeader = async () => {
    const { ok, uri } = await imagePick();
    if (ok) {
      dispatch({
        type: "setItem",
        payload: {
          header: uri,
        },
      });
    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value }],
  }));

  return (
    <Screen headerShown title="编辑个人资料">
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          style={[styles.main, animatedStyles]}
        >
          <TouchableOpacity onPress={pickHeader}>
            <Image
              style={[
                {
                  height: 180,
                  width,
                },
              ]}
              source={{
                uri: state.header,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              padding: 20,
              marginTop: -40,
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{ width: 65, height: 65 }}
              onPress={pickAvatar}
            >
              <Avatar size={65} url={state.avatar} />
            </TouchableOpacity>
            {state.robot ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={{ margin: 3 }}
              >
                <Icon name="robot" size={25} color="#aaa" />
              </Animated.View>
            ) : null}
            {state.lock ? (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={{ margin: 3 }}
              >
                <Icon name="lock" size={25} color="#aaa" />
              </Animated.View>
            ) : null}
          </View>
          <SplitLine start={0} end={width} />
          <View style={styles.itemContainer}>
            <Text style={styles.title}>昵称</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="输入昵称"
              underlineColorAndroid="transparent"
              value={state.displayName}
              onChangeText={(text) => {
                dispatch({
                  type: "setItem",
                  payload: {
                    displayName: text,
                  },
                });
              }}
            />
          </View>
          <SplitLine start={0} end={width} />
          <View style={styles.itemContainer}>
            <Text style={styles.title}>简介</Text>
            <TextInput
              multiline
              style={[styles.nameInput, { height: 100, marginTop: -5 }]}
              placeholder="输入简介"
              value={state.note}
              underlineColorAndroid="transparent"
              onChangeText={(text) => {
                dispatch({
                  type: "setItem",
                  payload: {
                    note: text,
                  },
                });
              }}
              onFocus={() => {
                // TODO：需要修改为react-native-keyboard-controller
                offset.value = withTiming(100, { duration: 250 });
              }}
              onEndEditing={() => {
                offset.value = withTiming(0, { duration: 250 });
              }}
            />
          </View>
          <SplitLine start={0} end={width} />
          <View
            style={[styles.itemContainer, { justifyContent: "space-between" }]}
          >
            <View>
              <Text style={styles.title}>机器人</Text>
              <Text style={styles.biref}>
                这个账户大多数操作时自动的，并且可能无人监控
              </Text>
            </View>
            <Switch
              value={state.robot}
              onValueChange={(value) => {
                dispatch({
                  type: "setItem",
                  payload: {
                    robot: value,
                  },
                });
              }}
            />
          </View>
          <SplitLine start={0} end={width} />
          <View
            style={[styles.itemContainer, { justifyContent: "space-between" }]}
          >
            <View>
              <Text style={styles.title}>锁定</Text>
              <Text style={styles.biref}>你需要手动审核所有的关注请求</Text>
            </View>
            <Switch
              value={state.lock}
              onValueChange={(value) => {
                dispatch({
                  type: "setItem",
                  payload: {
                    lock: value,
                  },
                });
              }}
            />
          </View>
          <SplitLine start={0} end={width} />
          <View
            style={[styles.itemContainer, { justifyContent: "space-between" }]}
          >
            <View>
              <Text style={styles.title}>附加信息</Text>
              <Text style={styles.biref}>
                将会在个人资料页上展示，最多4个内容
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                const oldFields = state.fields;
                if (oldFields.length < 4) {
                  oldFields.push({});
                  dispatch({
                    type: "setItem",
                    payload: {
                      fields: oldFields,
                    },
                  });
                } else {
                  console.log("最多支持四条内容");
                }
              }}
            >
              <Icon name="add" size={25} color={Colors.theme} />
            </TouchableOpacity>
          </View>
          {state.fields?.length > 0 &&
            state.fields?.map((field: AccountFields, index: number) => {
              return (
                <Animated.View
                  key={index}
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={{ flexDirection: "row", marginTop: 5 }}
                >
                  <TextInput
                    style={styles.filedName}
                    placeholder="描述"
                    underlineColorAndroid="transparent"
                    value={field?.name}
                    onChangeText={(text) => {
                      dispatch({
                        type: "setField",
                        payload: {
                          index,
                          name: text,
                          value: field?.value,
                        },
                      });
                    }}
                    onFocus={() => {
                      // TODO：需要修改为react-native-keyboard-controller
                      offset.value = withTiming(350 + index * 30, {
                        duration: 250,
                      });
                    }}
                    onEndEditing={() => {
                      offset.value = withTiming(0, { duration: 250 });
                    }}
                  />
                  <TextInput
                    style={styles.filedValue}
                    placeholder="内容"
                    underlineColorAndroid="transparent"
                    value={field?.value}
                    onChangeText={(text) => {
                      dispatch({
                        type: "setField",
                        payload: {
                          index,
                          name: field?.name,
                          value: text,
                        },
                      });
                    }}
                    onFocus={() => {
                      offset.value = withTiming(350, { duration: 250 });
                    }}
                    onEndEditing={() => {
                      offset.value = withTiming(0, { duration: 250 });
                    }}
                  />
                </Animated.View>
              );
            })}
          <Button
            style={styles.saveButton}
            textStyle={styles.headerText}
            text="保存"
            onPress={submit}
          />
        </Animated.ScrollView>
      </SafeAreaView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
  header: {
    paddingVertical: 0,
    height: 34,
    borderRadius: 17,
    backgroundColor: "red",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  nameInput: {
    fontSize: 16,
    marginHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  biref: {
    marginTop: 3,
    fontSize: 12,
    color: Colors.grayTextColor,
  },
  itemContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filedName: {
    fontSize: 16,
    marginLeft: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  filedValue: {
    fontSize: 16,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginHorizontal: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: "#bbb",
  },
  saveButton: {
    paddingVertical: 0,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 15,
    marginTop: 20,
  },
});

export default EditInfo;
