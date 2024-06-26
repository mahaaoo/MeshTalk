import {
  Timelines,
  Account,
  Relationship,
  FollowAndFansQueryParameters,
  Response,
  HashTag,
} from "../config/interface";
import { get, post } from "../utils/request";

export const getAccountsById = (id: string): Response<Account> => {
  const url = "/api/v1/accounts/" + id;

  return get<Account>(url);
};

// 获取当前账号的所有推文
export const getStatusesById = (
  id: string,
  params: object,
): Response<Timelines[]> => {
  const url = "/api/v1/accounts/" + id + "/statuses";

  return get<Timelines[]>(url, params);
};

// 获取当前账号的用户信息  返回当前用户账号信息
export const getSelfInformation = (): Response<Account> => {
  const url = "/api/v1/accounts/verify_credentials";

  return get<Account>(url);
};

// 获取当前账号的所有推文和回复
export const getStatusesReplyById = (
  id: string,
  params: object,
): Response<Timelines[]> => {
  const url =
    "/api/v1/accounts/" + id + "/statuses?exclude_replies=false&" + params;

  return get<Timelines[]>(url);
};

// 获取当前账号的所有媒体信息
export const getStatusesMediaById = (
  id: string,
  params: object,
): Response<Timelines[]> => {
  const defaultParams = {
    only_media: true,
  };

  const url = "/api/v1/accounts/" + id + "/statuses";

  return get<Timelines[]>(url, Object.assign(params, defaultParams));
};

// 获取当前账号的所有置顶消息
export const getStatusesPinById = (
  id: string,
  params: object,
): Response<Timelines[]> => {
  const defaultParams = {
    pinned: true,
  };

  const url = "/api/v1/accounts/" + id + "/statuses";

  return get<Timelines[]>(url, Object.assign(params, defaultParams));
};

// 获取点赞的内容
export const getFavouritesById = (params: object): Response<Timelines[]> => {
  const url = "/api/v1/favourites";

  return get<Timelines[]>(url, params);
};

// 获取当前登录用户与所传递用户的关系
export const getRelationships = (
  id: string[] | string,
): Response<Relationship[]> => {
  let url = "/api/v1/accounts/relationships?";
  if (Array.isArray(id)) {
    url += id.map((item) => `id[]=${item}`).join("&");
  } else {
    url = url + "id=" + id;
  }

  return get<Relationship[]>(url);
};

// 关注一个用户
export const followById = (id: string = ""): Response<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/follow";

  return post<Relationship>(url);
};

// 取关一个用户
export const unfollowById = (id: string = ""): Response<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/unfollow";

  return post<Relationship>(url);
};

// https://mastodon.example/api/v1/accounts/:id/followers
// 获取用户所有的粉丝
export const getFollowersById = (
  id: string = "",
  params?: Partial<FollowAndFansQueryParameters>,
): Response<Account[]> => {
  const url = "/api/v1/accounts/" + id + "/followers";

  return get<Account[]>(url, params);
};

// https://mastodon.example/api/v1/accounts/:id/following
// 获取用户的所有关注人
export const getFollowingById = (
  id: string = "",
  params?: Partial<FollowAndFansQueryParameters>,
): Response<Account[]> => {
  const url = "/api/v1/accounts/" + id + "/following";

  return get<Account[]>(url, params);
};

// Quickly lookup a username to see if it is available, skipping WebFinger resolution.
// 根据用户id查询账户信息
export const lookupAcct = (id: string): Response<Account> => {
  const defaultParams = {
    acct: id,
  };

  const url = "/api/v1/accounts/lookup";

  return get<Account>(url, defaultParams);
};

// 获取所有的屏蔽列表
export const blocks = (params: object): Response<Account[]> => {
  const url = "/api/v1/blocks";
  return get<Account[]>(url, params);
};

// 屏蔽（block）某人
export const block = (id: string): Response<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/block";
  return post<Relationship>(url);
};

// 解除屏蔽（block）某人
export const unblock = (id: string): Response<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/unblock";
  return post<Relationship>(url);
};

// 获取所有的静音列表
export const mutes = (params: object): Response<Account[]> => {
  const url = "/api/v1/mutes";
  return get<Account[]>(url, params);
};

// 静音（block）某人
export const mute = (id: string): Response<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/mute";
  return post<Relationship>(url);
};

// 解除静音（block）某人
export const unmute = (id: string): Response<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/unmute";
  return post<Relationship>(url);
};

// 移除粉丝
export const removeFollowers = (id: string): Response<Relationship> => {
  const url = "/api/v1/accounts/" + id + "/remove_from_followers";
  return post<Relationship>(url);
};

// 获取书签内容
export const bookmarks = (params?: Partial<FollowAndFansQueryParameters>): Response<Timelines[]> => {
  const url = "/api/v1/bookmarks";
  return get<Timelines[]>(url, params);
}

// 把推文加入到书签中
export const addBookmark = (id: string): Response<Timelines> => {
  const url = `/api/v1/statuses/${id}/bookmark`;
  return post<Timelines>(url)
}
// 把推文从书签中删除
export const deleteBookmark = (id: string): Response<Timelines> => {
  const url = `/api/v1/statuses/${id}/unbookmark`;
  return post<Timelines>(url)
}

// 获取关注的tag列表
export const followedTags = (params: object): Response<HashTag[]> => {
  const url = "/api/v1/followed_tags";

  return get<HashTag[]>(url, params);
}
