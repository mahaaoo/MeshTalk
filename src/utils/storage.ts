import AsyncStorage from "@react-native-async-storage/async-storage";

type AsyncStorageValue = string | null;
// 你可以扩展这个类型来支持更复杂的数据结构（例如，通过 JSON 序列化和反序列化）
type AsyncStorageJSONValue = Promise<string | null>;

export const setItem = async (key: string, value: string) => {
  try {
    console.log("setItem", {
      key,
      // value,
    });
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getItem = async (key: string): AsyncStorageJSONValue => {
  try {
    const value = await AsyncStorage.getItem(key);
    console.log("getItem", {
      key,
    });

    if (value !== null) {
      // value previously stored
      return value;
    }
  } catch (e) {
    // error reading value
    return null;
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // error reading value
  }
};
export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // error reading value
  }
};
