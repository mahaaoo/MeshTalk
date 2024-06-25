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

// 获取媒体文件的格式
export const getUrlType = (url: string): string => {
  if (!url || url.length <= 0) return "";
  const urlParts = url.split(".");
  const type = urlParts[urlParts.length - 1];
  return type;
};

// 获取媒体文件的名字
export const getUrlName = (url: string): string => {
  if (!url || url.length <= 0) return "";
  const urlParts = url.split("/");
  const name = urlParts[urlParts.length - 1];
  return name;
};

// 判断是否是合理的链接
export const isValidURL = (str: string): boolean => {  
  try {  
      new URL(str);  
      return true;  
  } catch (_) {  
      return false;  
  }  
}

// about:///https/o3o.ca/@foxyearthO
// https://m.cmx.im/@strawberry
export const getAcctFromUrl = (url: string): string => {
  // 判断字符串是否以"about"开头  
  const atIndex = url.lastIndexOf('@');  
    
  // 如果找到了"@"且其位置不是字符串的开头  
  if (atIndex !== -1 && atIndex !== 0) {  
      // 提取"@"之后的内容
      return url.substring(atIndex + 1); // 或者使用 str.slice(atIndex + 1)  
  }  
  
  return "";  
}
