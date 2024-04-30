import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async(key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      return value;
    }
    return '';
  } catch (e) {
    // error reading value
    return '';
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
