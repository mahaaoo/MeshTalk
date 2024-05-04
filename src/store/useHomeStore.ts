import { Toast } from "react-native-ma-modal";
import { create } from "zustand";

import accountStore from "./useAccountStore";
import { RefreshState } from "../components/RefreshList";
import { Timelines } from "../config/interface";
import { verifyToken } from "../server/app";
import { homeLine } from "../server/timeline";

interface HomeStoreState {
  dataSource: Timelines[];
  listStatus: RefreshState;
  fetchHomeData: () => void;
  verifyToken: () => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const useHomeStore = create<HomeStoreState>((set, get) => ({
  dataSource: [],
  listStatus: RefreshState.Idle,
  fetchHomeData: async () => {
    const data = await homeLine();
    if (data) {
      if (data.length > 0) {
        set({ dataSource: data });
      } else {
        // 主页没有数据
        Toast.show("主页没有数据");
      }
    }
    set({ listStatus: RefreshState.Idle });
  },
  verifyToken: async () => {
    const data = await verifyToken();
    if (data) {
      accountStore.getState().setCurrentAccount(data);
      get().fetchHomeData();
    }
  },
  onRefresh: () => {
    set({ listStatus: RefreshState.HeaderRefreshing });
    get().fetchHomeData();
  },
  onLoadMore: async () => {
    set({ listStatus: RefreshState.FooterRefreshing });
    const maxId = get().dataSource[get().dataSource.length - 1].id;
    const data = await homeLine(`?max_id=${maxId}`);
    if (data) {
      set({ dataSource: get().dataSource.concat(data) });
    }
    set({ listStatus: RefreshState.Idle });
  },
}));

export default useHomeStore;
