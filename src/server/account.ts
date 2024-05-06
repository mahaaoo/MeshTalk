import { Timelines, Account, Relationship } from "../config/interface";
import { get, post } from "../utils/request";

export const getAccountsById = (id: string): Promise<Account> => {
  const url = "/api/v1/accounts/" + id;

  return get<Account>(url);
};

// 获取当前账号的所有推文
export const getStatusesById = (
  id: string,
  params: string = "",
): Promise<Timelines[]> => {
  const url = "/api/v1/accounts/" + id + "/statuses" + params;

  return get<Timelines[]>(url);
};

// 获取当前账号的用户信息  返回当前用户账号信息
export const getSelfInformation = (): Promise<Account> => {
  const url = "/api/v1/accounts/verify_credentials";

  return get<Account>(url);
};

// 获取当前账号的所有推文和回复
export const getStatusesReplyById = (
  id: string,
  params: string = "",
): Promise<Timelines[]> => {
  const url =
    "/api/v1/accounts/" + id + "/statuses?exclude_replies=false&" + params;

  return get<Timelines[]>(url);
};

// 获取当前账号的所有媒体信息
export const getStatusesMediaById = (
  id: string,
  params: string = "",
): Promise<Timelines[]> => {
  const url = "/api/v1/accounts/" + id + "/statuses?only_media=true&" + params;

  return get<Timelines[]>(url);
};

// 获取当前账号的所有置顶消息
export const getStatusesPinById = (
  id: string,
  params: string = "",
): Promise<Timelines[]> => {
  const url = "/api/v1/accounts/" + id + "/statuses?pinned=true&" + params;

  return get<Timelines[]>(url);
};

// 获取点赞的内容
export const getFavouritesById = (
  params: string = "",
): Promise<Timelines[]> => {
  const url = "/api/v1/favourites" + params;

  return get<Timelines[]>(url);
};

// 获取当前登录用户与所传递用户的关系
export const getRelationships = (
  id: string[] | string,
): Promise<Relationship[]> => {
  let url = "/api/v1/accounts/relationships?";
  if (Array.isArray(id)) {
    url += id.map((item) => `id[]=${item}`).join("&");
  } else {
    url = url + "id=" + id;
  }

  return get<Relationship[]>(url);
};

// 关注一个用户
export const followById = (id: string = ""): Promise<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/follow";

  return post<Relationship>(url);
};

// 取关一个用户
export const unfollowById = (id: string = ""): Promise<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/unfollow";

  return post<Relationship>(url);
};

// https://mastodon.example/api/v1/accounts/:id/followers
// 获取用户所有的粉丝
export const getFollowersById = (
  id: string = "",
  params: string = "",
): Promise<Account[]> => {
  const url = "/api/v1/accounts/" + id + "/followers" + params;

  return get<Account[]>(url);
};

// https://mastodon.example/api/v1/accounts/:id/following
// 获取用户的所有关注人
export const getFollowingById = (
  id: string = "",
  params: string = "",
): Promise<Account[]> => {
  const url = "/api/v1/accounts/" + id + "/following" + params;

  return get<Account[]>(url);
};
