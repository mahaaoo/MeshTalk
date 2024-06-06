import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

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
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return {
        ok: true,
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        fileInfo,
      };
    }
  } else {
    console.log("MEDIA PERMISSIONS ERROR!!");
  }
  return {
    ok: false,
  };
};
