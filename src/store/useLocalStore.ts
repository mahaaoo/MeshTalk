import { Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { RefreshState } from "../components/RefreshList";
import { Timelines } from "../config/interface";
import { localLine } from "../server/timeline";

interface LocalStoreState {
  dataSource: Timelines[];
  listStatus: RefreshState;
  fetchLocalData: () => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const useLocalStore = create<LocalStoreState>((set, get) => ({
  dataSource: [],
  listStatus: RefreshState.Idle,
  fetchLocalData: async () => {
    const data = await localLine();
    if (data) {
      if (data.length > 0) {
        set({ dataSource: data });
      } else {
        Toast.show("没有数据");
      }
    }
    set({ listStatus: RefreshState.Idle });
  },
  onRefresh: () => {
    set({ listStatus: RefreshState.HeaderRefreshing });
    get().fetchLocalData();
  },
  onLoadMore: async () => {
    set({ listStatus: RefreshState.FooterRefreshing });
    const maxId = get().dataSource[get().dataSource.length - 1].id;
    const data = await localLine(`?max_id=${maxId}`);
    if (data) {
      set({ dataSource: get().dataSource.concat(data) });
    }
    set({ listStatus: RefreshState.Idle });
  },
}));

export default useLocalStore;
