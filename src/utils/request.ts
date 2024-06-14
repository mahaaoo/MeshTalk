import * as Sentry from "@sentry/react-native";
import { create, ApiResponse } from "apisauce";
import { AxiosRequestConfig } from "axios";

import { Response } from "../config/interface";

const api = create({
  timeout: 15000,
  baseURL: "",
});

api.addRequestTransform((request) => {
  // console.log(Stores.appStore.token);

  console.log("\n===================请求拦截器=================");
  console.log(`请求地址：${request?.url}`);
  console.log(`请求方式：${request?.method}`);
  console.log("请求参数：");
  console.log(request?.data);
  console.log(request?.params);
  console.log(request?.headers);
  console.log("============================================\n");
});

api.addResponseTransform((response) => {
  console.log("\n===================响应拦截器=================");
  console.log(`返回`);
  console.log(`返回状态：${response?.status}`);
  if (response?.status !== 200) {
    console.log(response);
  }
  // console.log('返回数据：', response.data);
  console.log("============================================\n");
});

const get = <T>(
  url: string,
  params?: object,
  axiosConfig?: AxiosRequestConfig,
): Response<T> => {
  return api
    .get(url, params, axiosConfig)
    .then((response: ApiResponse<T>) => {
      console.log({
        ok: response.ok,
        status: response.status,
        problem: response.problem,
      }); // 假设response有这些属性
      if (!response.ok) {
        Sentry.captureEvent({
          request: {
            url,
            data: params,
          },
          message: "request fail" + response?.originalError,
        });
      }
      return response;
    })
    .catch((error: any) => {
      console.log("catch", error);
      throw error;
    });
};

const post = <T>(
  url: string,
  data?: object,
  axiosConfig?: AxiosRequestConfig,
): Response<T> => {
  return api
    .post(url, data, axiosConfig)
    .then((response: ApiResponse<T>) => {
      console.log({
        ok: response.ok,
        status: response.status,
        problem: response.problem,
      }); // 假设response有这些属性
      if (!response.ok) {
        Sentry.captureEvent({
          request: {
            url,
            data,
          },
          message: "request fail" + response?.originalError,
        });
      }
      return response;
    })
    .catch((error: any) => {
      console.log("catch", error);
      throw error;
    });
};

const patch = <T>(
  url: string,
  data?: object,
  header?: AxiosRequestConfig,
): Response<T> => {
  api.setHeader("Content-Type", "multipart/form-data");

  return api
    .patch(url, data, header)
    .then((response: ApiResponse<T>) => {
      console.log({
        ok: response.ok,
        status: response.status,
        problem: response.problem,
      }); // 假设response有这些属性
      if (!response.ok) {
        Sentry.captureEvent({
          request: {
            url,
            data,
          },
          message: "request fail" + response.originalError,
        });
      }
      return response;
    })
    .catch((error: any) => {
      console.log("catch", error);
      throw error;
    })
    .finally(() => {
      api.setHeader("Content-Type", "application/json");
    });
};

const api_delete = <T>(
  url: string,
  params?: object,
  header?: AxiosRequestConfig,
): Response<T> => {
  return api
    .delete(url, params, header)
    .then((response: ApiResponse<T>) => {
      console.log({
        ok: response.ok,
        status: response.status,
        problem: response.problem,
      }); // 假设response有这些属性
      if (!response.ok) {
        Sentry.captureEvent({
          request: {
            url,
            data: params,
          },
          message: "request fail" + response.originalError,
        });
      }
      return response;
    })
    .catch((error: any) => {
      console.log("catch", error);
      throw error;
    })
};

export { get, post, api, patch, api_delete };
