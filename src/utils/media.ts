import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { openBrowserAsync } from "expo-web-browser";
import * as Linking from "expo-linking";
import { Platform, Share } from "react-native";
import { Loading, Toast } from "react-native-ma-modal";
import { isValidURL } from "./string";
import usePreferenceStore from "../store/usePreferenceStore";

// 获取缩小版尺寸的图片，上传头像等
export const imagePick = async () => {
  const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissions.granted) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri!;
      const fileSize = result.assets[0].fileSize;
      return {
        ok: true,
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        fileSize,
      };
    }
  } else {
    Toast.show("无相册相关权限");
  }
  return {
    ok: false,
  };
};

// 获取原始尺寸的图片，上传头像等
export const imageOriginPick = async () => {
  const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissions.granted) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri!;
      return {
        ok: true,
        uri,
        fileInfo: result.assets[0],
      };
    }
  } else {
    Toast.show("无相册相关权限");
  }
  return {
    ok: false,
  };
};

// 调用系统级分享
export const systemShare = async (url: string) => {
  try {
    const result = await Share.share({
      url,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    // Alert.alert(error.message);
    console.log(error.message);
  }
};

// 保存文件，保存图片等
export const fileSave = async (url: string) => {
  const permissions = await MediaLibrary.requestPermissionsAsync();
  Loading.show();
  if (permissions.granted) {
    const urlParts = url.split("/");
    const urlName = urlParts[urlParts.length - 1];

    const { uri } = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + urlName,
    );

    console.log("file uri", uri);
    await MediaLibrary.saveToLibraryAsync(uri);
    Loading.hide();

    Toast.show("已保存至相册");
  } else {
    Loading.hide();

    Toast.show("无相册相关权限");
  }
};

export const openURL = (url: string) => {
  // 根据用户偏好，选择在app内打开还是在浏览器打开
  if (isValidURL(url)) {
    const type = usePreferenceStore.getState().openURLType;
    if (type === "open_link_in_app") {
      openBrowserAsync(url);
    } else if (type === "open_link_in_browser") {
      Linking.openURL(url);
    }
  }
};
