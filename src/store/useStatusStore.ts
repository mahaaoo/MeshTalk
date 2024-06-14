import { create } from "zustand";

// 隐私内容已经点击过显示，则记录下来，避免因为list重用而导致的错误渲染

interface StatusState {
  sensitiveSet: Set<string>;
  addSensitive: (id: string) => void;
  checkSensitive: (id: string) => boolean;
  resetStore: () => void; // 删除store所有内容
}

const useStatusStore = create<StatusState>((set, get) => ({
  sensitiveSet: new Set(),
  addSensitive: (id: string) => {
    get().sensitiveSet.add(id);
  },
  checkSensitive: (id: string) => {
    return get().sensitiveSet.has(id);
  },
  resetStore: () =>
    set({
      sensitiveSet: new Set(),
    }),
}));

export default useStatusStore;
