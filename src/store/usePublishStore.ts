import { Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { postNewStatuses } from "../server/status";
import { goBack } from "../utils";

interface PublishStoreState {
  statusContent: string;
  inputContent: (input: string) => void;
  postNewStatuses: (param: object) => void;
}

const usePublishStore = create<PublishStoreState>((set, get) => ({
  statusContent: "",
  inputContent: (input: string) => set({ statusContent: input }),
  postNewStatuses: async (param: object) => {
    const { data, ok } = await postNewStatuses(param);
    if (data && ok) {
      set({ statusContent: "" });
      Toast.show("发表成功");
      goBack();
    } else {
      Toast.show("发表失败");
    }
  },
}));

export default usePublishStore;
