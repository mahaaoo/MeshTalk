import { Dimensions, Platform, PixelRatio } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { create } from "zustand";

const { width, height } = Dimensions.get("window");

interface DeviceStoreState {
  width: number;
  height: number;
  onePixel: number;
  insets: EdgeInsets;
  platform: string;
  headerHeight: number;
}

const useDeviceStore = create<DeviceStoreState>((set, get) => ({
  width,
  height,
  onePixel: 1 / PixelRatio.get(),
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
  platform: Platform.OS,
  headerHeight: 0,
}));

export default useDeviceStore;
