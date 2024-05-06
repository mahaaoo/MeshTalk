import { Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { RefreshState } from "../components/RefreshList";
import { Timelines } from "../config/interface";
import { publicLine } from "../server/timeline";

interface PublicStoreState {
  dataSource: Timelines[];
  listStatus: RefreshState;
  fetchPublicData: () => void;
  onRefresh: () => void;
  onLoadMore: () => void;
}

const usePublicStore = create<PublicStoreState>((set, get) => ({
  dataSource: [],
  listStatus: RefreshState.Idle,
  fetchPublicData: async () => {
    const data = await publicLine();
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
    get().fetchPublicData();
  },
  onLoadMore: async () => {
    set({ listStatus: RefreshState.FooterRefreshing });
    const maxId = get().dataSource[get().dataSource.length - 1].id;
    const data = await publicLine(`?max_id=${maxId}`);
    if (data) {
      set({ dataSource: get().dataSource.concat(data) });
    }
    set({ listStatus: RefreshState.Idle });
  },
}));

export default usePublicStore;
