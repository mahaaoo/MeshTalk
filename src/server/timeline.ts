import { Timelines, Response, HashTag, Suggestion } from "../config/interface";
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
export const trendsTags = (limit: number = 10): Response<HashTag[]> => {
  const url = "/api/v1/trends/tags";
  const params = {
    limit,
  };

  return get<HashTag[]>(url, params);
};

// 当前趋势-嘟文
export const trendsStatuses = (limit: number = 10): Response<Timelines[]> => {
  const url = "/api/v1/trends/statuses";
  const params = {
    limit,
  };

  return get<Timelines[]>(url, params);
};

// 推荐关注
export const suggestions = (limit: number = 10): Response<Suggestion[]> => {
  const url = "/api/v2/suggestions";
  const params = {
    limit,
  };

  return get<Suggestion[]>(url, params);
};
