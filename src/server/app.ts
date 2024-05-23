import {
  AppInterface,
  AppToken,
  Account,
  Emoji,
  ServersCategory,
  ServersLanguage,
  MastodonServers,
  MastodonServersPrams,
  Response,
} from "../config/interface";
import { ClientName, Scopes, RedirectUris } from "../config/oauth";
import { get, post } from "../utils/request";

// 获取app注册在即将登录的站点内信息
export const getAppConfig = (host: string): Response<AppInterface> => {
  const url = host + "/api/v1/apps";

  const params = {
    client_name: ClientName,
    redirect_uris: RedirectUris,
    scopes: Scopes,
  };

  return post<AppInterface>(url, params);
};

// 获取token信息
export const getToken = (host: string, param: object): Response<AppToken> => {
  const url = host + "/oauth/token";
  const params = {
    redirect_uri: RedirectUris,
    grant_type: "authorization_code",
    ...param,
  };

  return post<AppToken>(url, params);
};

// 校验token是否有效 获取当前账户信息
export const verifyToken = (): Response<Account> => {
  const url = "/api/v1/accounts/verify_credentials";

  return get<Account>(url);
};

// 获取实例的emojis
export const getInstanceEmojis = (): Response<Emoji[]> => {
  const url = "/api/v1/custom_emojis";

  return get<Emoji[]>(url);
};

// 服务器支持语言
export const getServersLanguage = (): Response<ServersLanguage[]> => {
  const url = "https://api.joinmastodon.org/languages";
  return get(url);
};

// 服务器支持地区
export const getServersCategory = (): Response<ServersCategory[]> => {
  const url = "https://api.joinmastodon.org/categories";
  return get(url);
};

// 实例服务器列表
export const getMastodonServers = (
  params?: MastodonServersPrams,
): Response<MastodonServers[]> => {
  const url = "https://api.joinmastodon.org/servers";

  return get(url, params);
};
