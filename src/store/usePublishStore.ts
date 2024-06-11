import { api } from "@utils/request";
import { getUrlName, getUrlType } from "@utils/string";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Loading, Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { postNewStatuses, media } from "../server/status";

interface PublishStoreState {
  statusContent: string;
  mediaList: ImagePickerAsset[];
  inputContent: (input: string) => void;
  addMedia: (media: ImagePickerAsset) => void;
  deleteMedia: (index: number) => void;
  postNewStatuses: (param: object) => void;
}

const usePublishStore = create<PublishStoreState>((set, get) => ({
  statusContent: "",
  mediaList: [],
  inputContent: (input: string) => set({ statusContent: input }),
  addMedia: (media: ImagePickerAsset) => {
    const newMediaList = [...get().mediaList];
    newMediaList.push(media);
    set({ mediaList: newMediaList });
  },
  deleteMedia: (index: number) => {
    const newMediaList = [...get().mediaList];
    newMediaList.splice(index, 1);
    set({ mediaList: newMediaList });
  },
  postNewStatuses: async (param: object) => {
    let params = param;
    if (get().mediaList.length === 0 && get().statusContent.length === 0) {
      return Toast.show("请输入内容");
    }

    if (get().mediaList.length > 0) {
      Loading.show();
      const fecthQueue = get().mediaList;
      const mediaResult = [];
      while (fecthQueue.length > 0) {
        const mediaRequest = fecthQueue.shift();

        const formData = new FormData();

        formData.append("file", {
          uri: mediaRequest?.uri,
          name: getUrlName(mediaRequest?.uri!),
          type: getUrlType(mediaRequest?.uri!),
        } as unknown as Blob);

        const { data, ok } = await media(formData);

        if (ok && data) {
          mediaResult.push(data.id);
        }
      }
      params = {
        ...params,
        media_ids: mediaResult,
      };
    }

    api.setHeader("Content-Type", "application/json");
    const { data, ok } = await postNewStatuses(params);
    Loading.hide();
    if (data && ok) {
      set({ statusContent: "" });
      Toast.show("发表成功");
      router.back();
    } else {
      Toast.show("发表失败");
    }
  },
}));

export default usePublishStore;
