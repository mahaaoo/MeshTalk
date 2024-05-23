import { Avatar, Button, Screen, SplitLine } from "@components";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { Colors } from "../../config";
import { Account } from "../../config/interface";
import { verifyToken } from "../../server/app";
import { updateCredentials } from "../../server/status";
import useDeviceStore from "../../store/useDeviceStore";

interface EditInfoProps {}

const EditInfo: React.FC<EditInfoProps> = (props) => {
  const navigation = useNavigation();
  const [account, setAccount] = useState<Account>();
  const [avatar, setAvatar] = useState("");

  const { width } = useDeviceStore();

  useEffect(() => {
    const fetchAccount = async () => {
      const { data, ok } = await verifyToken();
      if (ok && data) {
        setAccount(data);
      }
    };

    const submit = async () => {
      const { data, ok } = await updateCredentials({
        avatar,
      });
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
  }, [avatar]);

  const pickAvatar = async () => {
    const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissions.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        const filename = localUri.split("/").pop();

        // Infer the type of the image
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        // Assume "photo" is the name of the form field the server expects
        formData.append("avatar", {
          uri: localUri.replace("file://", ""),
          name: filename,
          type,
        });

        // console.log("binary", formData.get("file"));
        const { data, ok } = await updateCredentials(formData);

        setAvatar(result.assets[0].uri);
      }
    }

    // No permissions request is necessary for launching the image library
  };

  return (
    <Screen headerShown title="编辑个人资料">
      <ScrollView style={styles.main}>
        <Image
          style={[
            {
              height: 180,
              width,
            },
          ]}
          source={{
            uri: account?.header,
          }}
        />
        <TouchableOpacity
          onPress={pickAvatar}
          style={{ padding: 15, marginTop: -40 }}
        >
          <Avatar size={65} url={avatar || account?.avatar} />
        </TouchableOpacity>
        <SplitLine start={0} end={width} />
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
        >
          <Text style={styles.title}>昵称</Text>
          <TextInput
            style={styles.nameInput}
            placeholder={account?.display_name || account?.username}
            underlineColorAndroid="transparent"
          />
        </View>
        <SplitLine start={0} end={width} />
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
        >
          <Text style={styles.title}>简介</Text>
          <TextInput
            multiline
            style={styles.nameInput}
            placeholder="输入简介"
            underlineColorAndroid="transparent"
          />
        </View>
      </ScrollView>
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
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditInfo;
