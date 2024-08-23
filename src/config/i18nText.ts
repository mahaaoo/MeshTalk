import { Library } from "../components/Icon/library";

export interface PostVisibility {
  title: string;
  key: string;
  icon: keyof typeof Library;
}

export const getPostVisibility = (): PostVisibility[] => {
  return [
    {
      title: "new_status_ares_public",
      key: "public",
      icon: "unlock",
    },
    {
      title: "new_status_ares_unlist",
      key: "unlisted",
      icon: "replyLock",
    },
    {
      title: "new_status_ares_follow_only",
      key: "private",
      icon: "replyFollow",
    },
    {
      title: "new_status_ares_direct",
      key: "direct",
      icon: "replyAite",
    },
  ];
};
