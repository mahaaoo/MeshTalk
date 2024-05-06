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
    const data = await postNewStatuses(param);
    if (data) {
      set({ statusContent: "" });
      Toast.show("发送成功");
      goBack();
    }
  },
}));

export default usePublishStore;
