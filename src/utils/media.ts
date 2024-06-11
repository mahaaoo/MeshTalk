import * as FileSystem from "expo-file-system";
import { FileInfo } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Platform, Share } from "react-native";
import { Loading, Toast } from "react-native-ma-modal";

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
