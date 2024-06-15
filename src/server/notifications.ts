import {
  Notification,
  Response,
  AnnouncementInterface,
} from "../config/interface";
import { api_delete, get, post, put } from "../utils/request";

// 获取所有的通知信息
export const getNotifications = (params: object): Response<Notification[]> => {
  const url = "/api/v1/notifications";

  return get<Notification[]>(url, params);
};

// 获取该站点的公告信息
// /api/v1/announcements
export const announcements = (): Response<AnnouncementInterface[]> => {
  const url = "/api/v1/announcements";

  return get<AnnouncementInterface[]>(url);
};

// 向公告添加一个反馈
export const addReaction = (id: string, name: string): Response<object> => {
  const url = `/api/v1/announcements/${id}/reactions/${name}`;

  return put<object>(url);
};

// 向公告取消一个反馈
export const deleteReaction = (id: string, name: string): Response<object> => {
  const url = `/api/v1/announcements/${id}/reactions/${name}`;

  return api_delete<object>(url);
};

// 已读一条公告
export const dismissAnnounce = (id: string): Response<object> => {
  const url = `/api/v1/announcements/${id}/dismiss`;

  return post<object>(url);
};
