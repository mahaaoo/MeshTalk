import React, { MutableRefObject } from "react";
import { GestureType } from "react-native-gesture-handler";
import { AnimatedRef, Easing, SharedValue } from "react-native-reanimated";

export type GestureTypeRef = MutableRefObject<GestureType | undefined>;

export interface HeadTabViewContextProps {
  scrollY: SharedValue<number>;
  handleChildRef: (ref: GestureTypeRef) => void;
  onScrollCallback: (y: number) => void;
  currentIndex: number;
  id: string;
  enable: SharedValue<boolean>;
  stickyHeight: number;
  arefs: MutableRefObject<AnimatedRef<any>[]>;
}

export const HeadTabViewContext = React.createContext<HeadTabViewContextProps>(
  {} as HeadTabViewContextProps,
);
export const useHeadTabView = () => React.useContext(HeadTabViewContext);

export const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);
export const IMAGE_HEIGHT = 150; // 顶部下拉放大图片的高度
export const HEADER_HEIGHT = 104; // 上滑逐渐显示的Header的高度, sticky最终停止的高度
export const PULL_OFFSETY = 100; // 下拉刷新的触发距离
