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

interface NewStatusParams {
  mediaList: ImagePickerAsset[];

  sensitive: boolean;
  reply: string; // 需要replyObj转换
  status: string;
  spoiler_text: string;
}

interface PublishStoreState {
  postNewStatuses: (params: NewStatusParams) => void;
}

const usePublishStore = create<PublishStoreState>((set, get) => ({
  postNewStatuses: async (params: NewStatusParams) => {
    const { reply, mediaList, sensitive, status, spoiler_text } = params;
    // 设置嘟文可见范围
    const visibilityValue = replyObj.filter(
      (replyItem) => replyItem.key === reply,
    )[0];

    let buildParams: any = {
      sensitive,
      status,
      visibility: visibilityValue.value,
    };

    // 没有文字信息也没有媒体信息，则认为是无效的文字发表内容
    if (mediaList.length === 0 && status.length === 0) {
      return Toast.show("请输入内容");
    }

    Loading.show();

    // 多媒体信息请求队列
    if (mediaList.length > 0) {
      const fecthQueue = [...mediaList];
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
      buildParams = {
        ...buildParams,
        media_ids: mediaResult,
      };
    }

    // 如果有警告内容，添加隐私提醒到参数中
    if (sensitive) {
      buildParams = {
        ...buildParams,
        spoiler_text,
      };
    }

    // 在media借口中设置了请求头信息，这个修改回来
    api.setHeader("Content-Type", "application/json");

    const { data, ok } = await postNewStatuses(buildParams);
    Loading.hide();
    if (data && ok) {
      Toast.show("发表成功");
      router.back();
    } else {
      Toast.show("发表失败");
    }
  },
}));

export default usePublishStore;
