import { Notification, Response } from "../config/interface";
import { get } from "../utils/request";

export const getNotifications = (params: object): Response<Notification[]> => {
  const url = "/api/v1/notifications";

  return get<Notification[]>(url, params);
};
