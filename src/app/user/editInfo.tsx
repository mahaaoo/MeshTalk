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
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { Colors } from "../../config";
import { Account, AccountFields } from "../../config/interface";
import { verifyToken } from "../../server/app";
import { updateCredentials } from "../../server/status";
import useDeviceStore from "../../store/useDeviceStore";

function reducer(state: EditInfoState, action: EditInfoAction) {
  switch (action.type) {
    case "init": {
      const account = action.payload as Account;
      return {
        account,
        avatar: account.avatar,
        displayName: account.display_name,
        header: account.header,
        note: account.source.note,
        robot: account.bot,
        lock: account.locked,
        fields: account.source.fields,
      };
    }
    case "setItem":
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
}

interface EditInfoState {
  avatar: string;
  displayName: string;
  account: Account;
  header: string;
  note: string;
  robot: boolean;
  lock: boolean;
  fields: AccountFields[];
}

interface EditInfoAction {
  type: string;
  payload: any;
}

const initialState = {
  avatar: "",
  displayName: "",
  account: undefined,
  header: "",
  note: "",
  robot: false,
  lock: false,
  fields: [],
};

interface EditInfoProps {}

const EditInfo: React.FC<EditInfoProps> = (props) => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { width } = useDeviceStore();

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

    const submit = async () => {
      // const { data, ok } = await updateCredentials({
      //   avatar,
      // });
      // const uriParts = uri.split(".");
      // const fileType = uriParts[uriParts.length - 1];
      // const { data, ok } = await updateCredentials(formData);
      // if (ok && data) {
      //   // setAccount(data);
      // }
      // const formData = new FormData();
      // // 创建文件对象
      // formData.append("avatar", {
      //   uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      //   name: `photo.${fileType}123`,
      //   type: `image/${fileType}`,
      // } as unknown as Blob);
    };

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
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
          text="保存"
          onPress={submit}
        />
      ),
    });

    fetchAccount();
  }, []);

  const pickAvatar = async () => {
    const { ok, uri, fileInfo } = await imagePick();
    if (ok) {
      const isSizeOk = fileInfo?.size / 1024 / 1024 < 2;
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

  return (
    <Screen headerShown title="编辑个人资料">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.main}>
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
              onTextInput={(text) => {
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
              onTextInput={(text) => {
                dispatch({
                  type: "setItem",
                  payload: {
                    note: text,
                  },
                });
              }}
            />
          </View>
          <SplitLine start={0} end={width} />
          <View
            style={[styles.itemContainer, { justifyContent: "space-between" }]}
          >
            <Text style={styles.title}>机器人</Text>
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
            <Text style={styles.title}>锁定</Text>
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
            <Text style={styles.title}>附加信息</Text>
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
                    onTextInput={(text) => {}}
                  />
                  <TextInput
                    style={styles.filedValue}
                    placeholder="内容"
                    underlineColorAndroid="transparent"
                    value={field?.value}
                    onTextInput={(text) => {}}
                  />
                </Animated.View>
              );
            })}
        </ScrollView>
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
    marginRight: 10,
  },
  header_text: {
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
});

export default EditInfo;
