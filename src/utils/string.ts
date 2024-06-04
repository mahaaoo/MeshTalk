// 每间隔三个数字加一个逗号

import useAppStore from "../store/useAppStore";

// 1930492 => 1,930,492
export const stringAddComma = (string: number): string => {
  if (!string) {
    return "0";
  }
  return Number(string).toLocaleString();
};

// 校验用户名是否合规，包含了实例的名称
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
