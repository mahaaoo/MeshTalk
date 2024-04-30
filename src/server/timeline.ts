import request, {MethodType} from '../utils/request';
import {Timelines} from '../config/interface';

// 获取关注人的信息
export const homeLine = (params: string = ''): Promise<Array<Timelines>> => {
  const url = '/api/v1/timelines/home' + params;

  return request(url, MethodType.GET);
};

export const publicLine = (params: string = ''): Promise<Array<Timelines>> => {
  const url = '/api/v1/timelines/public' + params;

  return request(url, MethodType.GET);
};

export const localLine = (params: string = ''): Promise<Array<Timelines>> => {
  const url = '/api/v1/timelines/public?local=true' + params;

  return request(url, MethodType.GET);
};
