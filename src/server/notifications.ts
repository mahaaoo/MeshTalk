import request, {MethodType} from '../utils/request';
import {Notification} from '../config/interface';

export const getNotifications = (
  params: string = '',
): Promise<Array<Notification>> => {
  const url = '/api/v1/notifications' + params;

  return request(url, MethodType.GET);
};
