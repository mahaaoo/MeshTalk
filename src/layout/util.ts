import { Platform } from "react-native";

// 这里控制当前是否分栏显示，后续pad或者pc端都可以通过这里配置
export const columnLayout = (): boolean => {
  return Platform.OS === "web";
};
