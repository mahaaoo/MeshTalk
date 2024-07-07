import { Timelines, Response, HashTag, Suggestion, Card, Search } from "../config/interface";
import { get } from "../utils/request";

// 获取本人推文以及关注人
export const homeLine = (params: object): Response<Timelines[]> => {
  const url = "/api/v1/timelines/home";

  return get<Timelines[]>(url, params);
};

// 获取其他站点内容
export const publicLine = (params: object): Response<Timelines[]> => {
  const url = "/api/v1/timelines/public";

  return get<Timelines[]>(url, params);
};

// 获取本站点其他内容
export const localLine = (params: object): Response<Timelines[]> => {
  const url = "/api/v1/timelines/public?local=true";

  return get<Timelines[]>(url, params);
};

// 当前趋势-标签
export const trendsTags = (params: object): Response<HashTag[]> => {
  const url = "/api/v1/trends/tags";

  return get<HashTag[]>(url, params);
};

// 当前趋势-嘟文
export const trendsStatuses = (params: object): Response<Timelines[]> => {
  const url = "/api/v1/trends/statuses";

  return get<Timelines[]>(url, params);
};

// 当前趋势-链接
export const trendsLinks = (params: object): Response<Card[]> => {
  const url = "/api/v1/trends/links";

  return get<Card[]>(url, params);
};

// 推荐关注
export const suggestions = (params: object): Response<Suggestion[]> => {
  const url = "/api/v2/suggestions";

  return get<Suggestion[]>(url, params);
};

// 根据关键字搜索
export const search = (params: object): Response<Search> => {
  const url = "/api/v2/search";

  return get<Search>(url, params);
};
