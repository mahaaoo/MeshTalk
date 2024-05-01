import {get, post} from '../utils/request';
import {Timelines} from '../config/interface';

// https://mastodon.example/api/v1/statuses/:id
// 根据id查询一个推文详情
export const getStatusesById = (id: string = ''): Promise<Timelines> => {
  const url = '/api/v1/statuses/' + id;

  return get<Timelines>(url);
};

// https://mastodon.example/api/v1/statuses
// 发表一个推文
export const postNewStatuses = (params: Object): Promise<Timelines> => {
  const url = '/api/v1/statuses';

  return post<Timelines>(url, params);
};
