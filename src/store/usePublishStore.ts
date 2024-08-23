import { api } from "@utils/request";
import { getUrlName, getUrlType } from "@utils/string";
import { ImagePickerAsset } from "expo-image-picker";
import { router } from "expo-router";
import { Loading, Toast } from "react-native-ma-modal";
import { create } from "zustand";

import { postNewStatuses, media } from "../server/status";
import { getItem, setItem } from "@utils/storage";
import * as constant from "../config/constant";
import { PostVisibility } from "@config/i18nText";

export interface NewStatusParams {
  timestamp: string;
  mediaList: ImagePickerAsset[];

  sensitive: boolean;
  reply: PostVisibility; // 需要replyObj转换
  status: string;
  spoiler_text: string;

  in_reply_to_id: string;
}

interface PublishStoreState {
  drafts: NewStatusParams[];
  initDrafts: () => void;
  addToDrafts: (draft: NewStatusParams) => void;
  delFromDrafts: (timestamp: string) => void;
  postNewStatuses: (params: NewStatusParams) => void;
}

const usePublishStore = create<PublishStoreState>((set, get) => ({
  drafts: [],
  initDrafts: async () => {
    const draftsJson = await getItem(constant.STATUSDRAFTS);
    const newDraft = JSON.parse(draftsJson || "");
    console.log(`当前共有${newDraft.length}条嘟文保存在了本地草稿箱`);
    set({
      drafts: newDraft,
    });
  },
  addToDrafts: (draft: NewStatusParams) => {
    let newDraft = get().drafts;
    if (draft.timestamp.length === 0) {
      const draftsStatusParams = {
        ...draft,
        timestamp: new Date().getTime() + "",
      };
      newDraft.unshift(draftsStatusParams);
    } else {
      // 修改草稿箱的内容再次保存
      newDraft = newDraft.map((n) => {
        if (n.timestamp === draft.timestamp) {
          return {
            ...draft,
            timestamp: new Date().getTime() + "",
          };
        }
        return draft;
      });
    }
    set({
      drafts: newDraft,
    });
    // 草稿箱内容支持保存本地
    setItem(constant.STATUSDRAFTS, JSON.stringify(newDraft));
  },
  delFromDrafts: (timestamp: string) => {
    const newDraft = get().drafts;
    const index = newDraft.map((n) => n.timestamp).indexOf(timestamp);
    if (index !== -1) {
      newDraft.splice(index, 1);
      set({
        drafts: newDraft,
      });
      setItem(constant.STATUSDRAFTS, JSON.stringify(newDraft));
    }
  },
  postNewStatuses: async (params: NewStatusParams) => {
    const {
      reply,
      mediaList,
      sensitive,
      status,
      spoiler_text,
      timestamp,
      in_reply_to_id,
    } = params;

    let buildParams: any = {
      sensitive,
      status,
      visibility: reply.key,
      in_reply_to_id: in_reply_to_id.length > 0 ? in_reply_to_id : "",
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
      // 如果是草稿箱的内容，发表成功之后删除
      get().delFromDrafts(timestamp);
      Toast.show("发表成功");
      router.back();
    } else {
      Toast.show("发表失败");
    }
  },
}));

export default usePublishStore;
