import { MutableRefObject } from "react";
import { GestureType } from "react-native-gesture-handler";
import { Easing } from "react-native-reanimated";

export type GestureTypeRef = MutableRefObject<GestureType | undefined>;

export const RESET_TIMING_EASING = Easing.bezier(0.33, 1, 0.68, 1);
export const IMAGE_HEIGHT = 150; // 顶部下拉放大图片的高度
export const HEADER_HEIGHT = 104; // 上滑逐渐显示的Header的高度, sticky最终停止的高度
export const PULL_OFFSETY = 100; // 下拉刷新的触发距离
export const NUMBER_AROUND = 2; // 在判断关键节点的时候，在这个范围内即可算

export enum NestedScrollStatus {
  OutScrolling,
  InnerScrolling,
}
