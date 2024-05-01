import { Notification } from "../config/interface";
import { get } from "../utils/request";

export const getNotifications = (
  params: string = "",
): Promise<Notification[]> => {
  const url = "/api/v1/notifications" + params;

  return get<Notification[]>(url);
};
