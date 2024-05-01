import { Timelines } from "../config/interface";
import { get } from "../utils/request";

// 获取关注人的信息
export const homeLine = (params: string = ""): Promise<Timelines[]> => {
  const url = "/api/v1/timelines/home" + params;

  return get<Timelines[]>(url);
};

export const publicLine = (params: string = ""): Promise<Timelines[]> => {
  const url = "/api/v1/timelines/public" + params;

  return get<Timelines[]>(url);
};

export const localLine = (params: string = ""): Promise<Timelines[]> => {
  const url = "/api/v1/timelines/public?local=true" + params;

  return get<Timelines[]>(url);
};
