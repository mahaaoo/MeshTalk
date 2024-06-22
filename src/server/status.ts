import {
  Timelines,
  Response,
  Account,
  MediaAttachments,
  StatusContext,
} from "../config/interface";
import { get, patch, post, api, api_delete } from "../utils/request";

// https://mastodon.example/api/v1/statuses/:id
// 根据id查询一个推文详情
export const getStatusesById = (id: string = ""): Response<Timelines> => {
  const url = "/api/v1/statuses/" + id;

  return get<Timelines>(url);
};

// https://mastodon.example/api/v1/statuses
// 发表一个推文
export const postNewStatuses = (params: object): Response<Timelines> => {
  const url = "/api/v1/statuses";

  return post<Timelines>(url, params);
};

// 点赞一个推文
export const favouriteStatuses = (id: string): Response<Timelines> => {
  const url = `/api/v1/statuses/${id}/favourite`;

  return post<Timelines>(url);
};

// 取消点赞一个推文
export const unfavouriteStatuses = (id: string): Response<Timelines> => {
  const url = `/api/v1/statuses/${id}/unfavourite`;

  return post<Timelines>(url);
};

// 更新用户信息
export const updateCredentials = (params: object): Response<Account> => {
  const url = "/api/v1/accounts/update_credentials";
  return patch<Account>(url, params);
};

// 上传媒体文件
export const media = (param: object): Response<MediaAttachments> => {
  const url = "/api/v2/media";
  api.setHeader("Content-Type", "multipart/form-data");

  return post<MediaAttachments>(url, param);
};

// 删除指定id嘟文
export const deleteStatus = (id: string): Response<Timelines> => {
  const url = "/api/v1/statuses/" + id;

  return api_delete<Timelines>(url);
};

// 置顶嘟文
export const pinStatus = (id: string): Response<Timelines> => {
  const url = "/api/v1/statuses/" + id + "/pin";

  return post<Timelines>(url);
};

// 取消置顶嘟文
export const unpinStatus = (id: string): Response<Timelines> => {
  const url = "/api/v1/statuses/" + id + "/unpin";

  return post<Timelines>(url);
};


// https://mastodon.example/api/v1/statuses/:id
// 根据id查询一个推文详情
export const getStatusesContext = (id: string = ""): Response<StatusContext> => {
  const url = "/api/v1/statuses/" + id + "/context";

  return get<StatusContext>(url);
};
