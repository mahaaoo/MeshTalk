import { create } from "zustand";

import { Account } from "../config/interface";
import { verifyToken } from "../server/app";

interface AccountStoreState {
  currentAccount: Account | undefined;
  setCurrentAccount: (account: Account) => void;
  verifyToken: () => void;
}

const useAccountStore = create<AccountStoreState>((set, get) => ({
  currentAccount: undefined,
  setCurrentAccount: (account: Account) => {
    set({ currentAccount: account });
  },
  verifyToken: async () => {
    // 验证token是否有效，并返回当前账户信息
    const data = await verifyToken();
    console.log("验证token是否有效，并返回当前账户信息");
    if (data) {
      set({
        currentAccount: data,
      });
    }
  },
}));

export default useAccountStore;
