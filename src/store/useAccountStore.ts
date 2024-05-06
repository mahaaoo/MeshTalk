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
    const data = await verifyToken();
    if (data) {
      get().setCurrentAccount(data);
    }
  },
}));

export default useAccountStore;
