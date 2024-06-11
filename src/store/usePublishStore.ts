import { api } from "@utils/request";
import { getUrlName, getUrlType } from "@utils/string";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Loading, Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { postNewStatuses, media } from "../server/status";

const replyObj = [
  {
    key: "公开",
    value: "public",
  },
  {
    key: "不出现在公共时间线上",
    value: "unlisted",
  },
  {
    key: "仅关注者可见",
    value: "private",
  },
  {
    key: "仅提及的人可见",
    value: "direct",
  },
];

interface PublishStoreState {
  statusContent: string;
  mediaList: ImagePickerAsset[];
  warning: string;
  inputContent: (input: string) => void;
  warningInput: (input: string) => void;
  addMedia: (media: ImagePickerAsset) => void;
  deleteMedia: (index: number) => void;
  postNewStatuses: (sensitive: boolean, visibility: string) => void;
}

const usePublishStore = create<PublishStoreState>((set, get) => ({
  statusContent: "",
  warning: "",
  mediaList: [],
  inputContent: (input: string) => set({ statusContent: input }),
  warningInput: (input: string) => set({ warning: input }),
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
  postNewStatuses: async (sensitive: boolean, visibility: string) => {
    // 设置嘟文可见范围
    const visibilityValue = replyObj.filter(
      (reply) => reply.key === visibility,
    )[0];

    let params: any = {
      sensitive,
      status: get().statusContent,
      visibility: visibilityValue.value,
    };

    // 没有文字信息也没有媒体信息，则认为是无效的文字发表内容
    if (get().mediaList.length === 0 && get().statusContent.length === 0) {
      return Toast.show("请输入内容");
    }

    Loading.show();

    // 多媒体信息请求队列
    if (get().mediaList.length > 0) {
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

    // 如果有警告内容，添加隐私提醒到参数中
    if (sensitive) {
      params = {
        ...params,
        spoiler_text: get().warning,
      };
    }

    // 在media借口中设置了请求头信息，这个修改回来
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
