// 每间隔三个数字加一个逗号
// 1930492 => 1,930,492
export const stringAddComma = (string: number): string => {
  if (!string) {
    return "0";
  }
  return Number(string).toLocaleString();
};
