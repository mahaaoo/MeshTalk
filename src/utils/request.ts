import {create, ApiResponse} from 'apisauce'
import {useAppStore} from '../store';

const api = create({
  timeout: 3000,
  baseURL: ''
});

api.addRequestTransform(request => {
  // console.log(Stores.appStore.token);
  const currentAppStore = useAppStore.getState();

  const token =  'Bearer ' + currentAppStore.token;
  const hostURL = currentAppStore.hostURL;

  api.setHeader('Authorization', token);
  api.setBaseURL(hostURL);

  console.log('\n===================请求拦截器=================');
  console.log(`请求地址：${request.url}`);
  console.log(`请求方式：${request.method}`);
  console.log('请求参数：');
  console.log(request.data);
  console.log('============================================\n');

});

// // 请求拦截器
// api.interceptors.request.use(
//   (config: any) => {
//     console.log(Stores.appStore.token);

//     config.headers.Authorization = 'Bearer ' + Stores.appStore.token;
//     if (config.url.indexOf('http') < 0) {
//       //  如果请求url不包含主站地址，则添加
//       config.url = Stores.appStore.hostUrl + config.url;
//     }

//     console.log('\n===================请求拦截器=================');
//     console.log(`请求地址：${config.url}`);
//     console.log('请求参数：');
//     console.log(config.data);
//     console.log(config);
//     console.log('============================================\n');

//     return config;
//   },
//   error => {
//     throw error;
//   },
// );

api.addResponseTransform(response => {
  console.log('\n===================响应拦截器=================');
  console.log(`返回状态：${response.status}`);
  // console.log('返回数据：', response.data);
  console.log('============================================\n');
})

// // 接受拦截器
// instance.interceptors.response.use(
//   response => {
//     console.log('\n===================响应拦截器=================');
//     console.log(`返回状态：${response.status}`);
//     // console.log('返回数据：', response.data);
//     console.log('============================================\n');

//     return response;
//   },
//   error => {
//     console.log('返回了错误', error);
//     throw error;
//   },
// );

// export enum MethodType {
//   GET = 'get',
//   POST = 'post',
//   DELETE = 'delete',
//   PUT = 'put',
// }

// export interface Response extends AxiosResponse {
//   status: number;
//   data: ResponseProps;
// }

// export interface ResponseProps {
//   code: number;
//   msg: string;
//   data: any;
//   [key: string]: any;
// }

// const checkStatus = (response: Response, url: string) => {
//   if (response.status === 200) {
//     return response;
//   }

//   throw new Error(url);
// };

// const request = (
//   url: string,
//   method: MethodType,
//   params?: Object | null,
//   options?: any,
// ): Promise<any> => {
//   return api(url, {
//     method: method,
//     data: params,
//     ...options,
//   })
//     .then((response: Response) => checkStatus(response, url))
//     .then((response: Response) => {
//       return response.data;
//     })
//     .catch((error: any) => {
//       console.log('catch', error);
//       return Promise.reject(error);
//     });
// };

const get = async <T>(url, params?, axiosConfig?): Promise<T> => {
  return api.get(url, params, axiosConfig)
        .then((response: ApiResponse<T>) => { 
          console.log({ ok: response.ok, status: response.status, problem: response.problem }); // 假设response有这些属性  
          return response.data as T;
        })  
        .catch((error: any) => {
          console.log('catch', error);
          throw error;  
        });
}

const post = async <T>(url, data?, axiosConfig?): Promise<T> => {
  return api.post(url, data, axiosConfig)
      .then((response: ApiResponse<T>) => { 
        console.log({ ok: response.ok, status: response.status, problem: response.problem }); // 假设response有这些属性  
        return response.data as T;
      })  
      .catch((error: any) => {
          console.log('catch', error);
          throw error;  
        });
}

export {
  get,
  post
};
