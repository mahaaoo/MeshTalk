import { Timelines, Response } from "../config/interface";
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
