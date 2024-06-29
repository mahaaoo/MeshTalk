import { Timelines } from "../config/interface";

export interface StatusCtxTree {
  node: Timelines;
  children: any[];
  deep: number;
}

const buildTree = (
  arr: Timelines[],
  parentId: string,
  childrenArray: StatusCtxTree[],
  deep: number,
) => {
  arr.forEach((item) => {
    if (item.in_reply_to_id === parentId) {
      const node = {
        node: item,
        children: [],
        deep: deep,
      };
      node.children = [];
      buildTree(arr, item.id, node.children, deep + 1);
      childrenArray.push(node);
    }
  });
};

export const arrayToTree = (
  list: Timelines[],
  root: any,
  deep: number,
): StatusCtxTree => {
  const node = {
    node: root,
    children: [],
    deep: deep,
  };
  buildTree(list, root.id, node.children, deep + 1);
  return node;
};
