import { ApiResponse } from "apisauce";

export type Response<T> = Promise<ApiResponse<T>>;

export interface AppInterface {
  client_id: string;
  client_secret: string;
  id: string;
  name: string;
  redirect_uri: string;
  vapid_key: string;
  website: string;
}

export interface AppToken {
  access_token: string;
  token_type: string;
  scope: string;
  create_at: number;
}

// 媒体文件类型
export interface MediaAttachments {
  id: string;
  type: string;
  url: string;
  preview_url: string;
  remote_url: string;
  meta: string;
  description: string;
  blurhash: string;
}

export interface Mention {
  id: string;
  username: string;
  url: string;
  acct: string;
}

export interface Tag {
  name: string;
  url: string;
}

// 就是官网的Status对象
export interface Timelines {
  account: Account;
  application: Application;
  bookmarked: boolean;
  card: Card;
  content: string;
  created_at: string;
  emojis: Emoji[];
  favourited: boolean;
  favourites_count: number;
  id: string;
  in_reply_to_account_id: string;
  in_reply_to_id: string;
  language: string;
  media_attachments: MediaAttachments[];
  mentions: Mention[];
  muted: boolean;
  poll: string;
  reblog: Timelines;
  reblogged: boolean;
  reblogs_count: number;
  replies_count: number;
  sensitive: boolean;
  spoiler_text: string;
  tags: Tag[];
  uri: string;
  url: string;
  visibility: string;
  pinned: boolean;
}

export interface AccountFields {
  name: string;
  value: string;
  verified_at: string;
}

export interface Account {
  acct: string;
  avatar: string;
  avatar_static: string;
  bot: boolean;
  created_at: string;
  discoverable: boolean;
  display_name: string;
  emojis: any[];
  fields: AccountFields[];
  followers_count: number;
  following_count: number;
  group: boolean;
  header: string;
  header_static: string;
  id: string;
  last_status_at: string;
  locked: boolean;
  note: string;
  statuses_count: number;
  url: string;
  username: string;
  source: AccountSource;
}

export interface AccountSource {
  privacy: string;
  sensitive: boolean;
  language: string;
  note: string;
  fields: AccountFields[];
}

export interface Card {
  author_name: string;
  author_url: string;
  blurhash: string;
  description: string;
  embed_url: string;
  height: number;
  html: string;
  image: string;
  provider_name: string;
  provider_url: string;
  title: string;
  type: string;
  url: string;
  width: number;
}

export interface Emoji {
  shortcode: string;
  static_url: string;
  url: string;
  visible_in_picker: boolean;
  category: string;
}

export interface Application {
  name: string;
  website: string;
}

export interface Notification {
  account: Account;
  created_at: string;
  id: string;
  type: string;
  status: Timelines;
}

export interface Relationship {
  id: string;
  following: boolean;
  showing_reblogs: boolean;
  notifying: boolean;
  followed_by: boolean;
  blocking: boolean;
  blocked_by: boolean;
  muting: boolean;
  muting_notifications: boolean;
  requested: boolean;
  domain_blocking: boolean;
  endorsed: boolean;
}
export interface ServersCategory {
  category: string;
  servers_count: number;
}

export interface ServersLanguage {
  locale: string;
  language: string;
  servers_count: number;
}

export interface MastodonServers {
  domain: string;
  version: string;
  description: string;
  languages: string[];
  region: string;
  categories: string[];
  proxied_thumbnail: string;
  blurhash: string;
  total_users: number;
  last_week_users: number;
  approval_required: boolean;
}

export interface MastodonServersPrams {
  language?: string; // 从 https://api.joinmastodon.org/languages 获取
  category?: string; // 从 https://api.joinmastodon.org/categories 接口获取
  region?:
    | "All regions"
    | "Europe"
    | "North America"
    | "South America"
    | "Africa"
    | "Asia"
    | "Oceania";
  ownership?: "All" | "Public oranization" | "Private individual";
  registrations?: "All" | "Instand" | "Manual review";
}

// 定义一些可选的请求属性
export interface FollowAndFansQueryParameters {
  max_id: number;
  since_id: number;
  min_id: number;
  limit: number;
}

export interface AnnouncementReaction {
  name: string;
  count: number;
  me: boolean;
  url?: string; // 设置为可选，因为最后一个表情没有提供url
  static_url?: string; // 设置为可选，因为最后一个表情没有提供static_url
}

export interface AnnouncementInterface {
  id: string;
  content: string;
  starts_at?: string; // 设置为可选，因为值是null
  ends_at?: string; // 设置为可选，因为值是null
  all_day: boolean;
  published_at: string;
  updated_at: string;
  read: boolean;
  mentions: Mention[]; // 假设我们不知道这个数组的确切类型，或者它可以是任何类型的数组
  statuses: any[]; // 同样假设
  tags: Tag[]; // 同样假设
  emojis: Emoji[]; // 同样假设
  reactions: AnnouncementReaction[];
}

export interface StatusContext {
  ancestors: Timelines[];
  descendants: Timelines[];
}

export interface HashTagHistory {
  day: string;
  uses: string;
  accounts: string;
}

export interface HashTag {
  name: string;
  url: string;
  history: HashTagHistory[];
  following: boolean;
}

export interface Suggestion {
  source: "staff" | "past_interactions" | "global";
  account: Account;
}

export interface Search {
  accounts: Account[];
  statuses: Timelines[];
  hashtags: HashTag[];
}