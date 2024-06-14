// 每间隔三个数字加一个逗号

import useAppStore from "../store/useAppStore";

// 1930492 => 1,930,492
export const stringAddComma = (string: number): string => {
  if (!string) {
    return "0";
  }
  return Number(string).toLocaleString();
};

// 校验用户名是否合规，包含了实例的名称 实际上是处理acct
export const acctName = (name?: string): string => {
  if (!name) return "";
  if (!name.includes("@")) {
    // 不包含当前实例的名称
    const host = useAppStore.getState().hostURL || "";
    const hostName = host.replace(/^https?:\/\//, "");

    return `@${name}@${hostName}`;
  }
  return `@${name}`;
};

export const getUrlType = (url: string): string => {
  if (!url || url.length <= 0) return "";
  const urlParts = url.split(".");
  const type = urlParts[urlParts.length - 1];
  return type;
};

export const getUrlName = (url: string): string => {
  if (!url || url.length <= 0) return "";
  const urlParts = url.split("/");
  const name = urlParts[urlParts.length - 1];
  return name;
};
