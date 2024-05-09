import { Timelines, Response } from "../config/interface";
import { get, post } from "../utils/request";

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
