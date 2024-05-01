
// class AccountStore {
  // currentAccount: Account | undefined = undefined;

  // constructor() {
  //   makeAutoObservable(this);
  // }

  // setCurrentAccount = (account: Account) => {
  //   this.currentAccount = account;
  // };
// }

// export default new AccountStore();

import {create} from 'zustand'
import {Account} from '../config/interface';

interface AccountStoreState {
  currentAccount: Account | undefined,
  setCurrentAccount: (account: Account) => void;
}

const useAccountStore = create<AccountStoreState>((set) => ({
  currentAccount: undefined,
  setCurrentAccount: (account: Account) => {
    set({ currentAccount: account });
  },
}));

export default useAccountStore;
