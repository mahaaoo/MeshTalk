import { I18n } from "i18n-js";
import { Library } from "../components/Icon/library";

export interface PostVisibility {
  title: string;
  key: string;
  icon: keyof typeof Library;
}

export const getPostVisibility = (i18n: I18n): PostVisibility[] => {
  return [
    {
      title: i18n.t("new_status_ares_public"),
      key: "public",
      icon: "unlock",
    },
    {
      title: i18n.t("new_status_ares_unlist"),
      key: "unlisted",
      icon: "replyLock",
    },
    {
      title: i18n.t("new_status_ares_follow_only"),
      key: "private",
      icon: "replyFollow",
    },
    {
      title: i18n.t("new_status_ares_direct"),
      key: "direct",
      icon: "replyAite",
    },
  ];
};
