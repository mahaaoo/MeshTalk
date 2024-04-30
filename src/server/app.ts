import request, {MethodType} from '../utils/request';
import {ClientName, Scopes, RedirectUris} from '../config/oauth';
import {AppInterface, AppToken, Account, Emoji} from '../config/interface';

// 获取app注册在即将登录的站点内信息
export const getAppConfig = (host: string): Promise<AppInterface> => {
  const url = host + '/api/v1/apps';

  const params = {
    client_name: ClientName,
    redirect_uris: RedirectUris,
    scopes: Scopes,
  };

  return request(url, MethodType.POST, params);
};

// 获取token信息
export const getToken = (host: string, param: Object): Promise<AppToken> => {
  const url = host + '/oauth/token';
  const params = {
    redirect_uri: RedirectUris,
    grant_type: 'authorization_code',
    ...param,
  };

  return request(url, MethodType.POST, params);
};

// 校验token是否有效
export const verifyToken = (): Promise<Account> => {
  const url = '/api/v1/accounts/verify_credentials';

  return request(url, MethodType.GET);
};

// 获取实例的emojis
export const getInstanceEmojis = (): Promise<Emoji[]> => {
  const url = '/api/v1/custom_emojis';

  return request(url, MethodType.GET);
};
