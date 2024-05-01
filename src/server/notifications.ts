import {get} from '../utils/request';
import {Notification} from '../config/interface';

export const getNotifications = (
  params: string = '',
): Promise<Array<Notification>> => {
  const url = '/api/v1/notifications' + params;

  return get<Array<Notification>>(url);
};
