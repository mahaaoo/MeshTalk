import {get} from '../utils/request';
import {Timelines} from '../config/interface';

// 获取关注人的信息
export const homeLine = (params: string = ''): Promise<Array<Timelines>> => {
  const url = '/api/v1/timelines/home' + params;

  return get<Array<Timelines>>(url);
};

export const publicLine = (params: string = ''): Promise<Array<Timelines>> => {
  const url = '/api/v1/timelines/public' + params;

  return get<Array<Timelines>>(url);
};

export const localLine = (params: string = ''): Promise<Array<Timelines>> => {
  const url = '/api/v1/timelines/public?local=true' + params;

  return get<Array<Timelines>>(url);
};
