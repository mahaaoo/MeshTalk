import { Emoji } from "../config/interface";
import { useEmojiStore } from "../store";

interface Children {
  [key: string]: Node;
}

interface NodeOptionsType {
  parent?: Node | undefined;
  word?: boolean;
  depth?: number;
}

class Node {
  // 节点值
  public key: string;
  // 是否为单词最后节点
  public word: boolean;
  // 父节点的引用
  public parent: Node | undefined;
  // 子节点的引用（goto表）
  public children: Children = {};
  // failure表，用于匹配失败后的跳转
  public failure: Node | undefined = undefined;
  // 字符深度
  public depth: number = 0;

  constructor(key: string, options: NodeOptionsType = {}) {
    const { parent, word, depth } = options;

    this.key = key;
    this.parent = parent;
    this.word = word || false;
    this.depth = typeof depth === "number" ? depth : 1;
  }
}

class Tree {
  public root: Node;

  constructor() {
    this.root = new Node("root", {
      depth: 0,
    });
  }

  /**
   * 插入数据
   * @param key
   */
  insert(key: string): boolean {
    if (!key) return false;
    const keyArr = key.split("").reverse();
    const firstKey: any = keyArr.pop();
    const children = this.root.children;
    const len = keyArr.length;
    const firstNode = children[firstKey];

    // 第一个key
    if (!firstNode) {
      children[firstKey] = len
        ? new Node(firstKey)
        : new Node(firstKey, {
            word: true,
          });
    } else if (!len) {
      firstNode.word = true;
    }

    // 其他多余的key
    if (len >= 1) {
      this.insertNode(children[firstKey], keyArr, len + 1);
    }

    return true;
  }

  /**
   * 插入节点
   * @param node
   * @param word
   */
  insertNode(node: Node, word: string[], starLen: number) {
    const len = word.length;

    if (len) {
      let children: Children;
      children = node.children;

      const key: any = word.pop();
      let item = children[key];
      const isWord = len === 1;

      if (!item) {
        item = new Node(key, {
          parent: node,
          word: isWord,
          depth: starLen - len + 1,
        });
      } else if (!item.word) {
        item.word = isWord;
      }

      children[key] = item;
      this.insertNode(item, word, starLen);
    }
  }

  /**
   * 创建Failure表
   */
  createFailureTable() {
    // 获取树第一层
    let currQueue: Node[] = Object.values(this.root.children);
    while (currQueue.length > 0) {
      const nextQueue: Node[] = [];
      for (let i = 0; i < currQueue.length; i++) {
        const node: Node = currQueue[i];
        const key = node.key;
        const parent = node.parent;
        node.failure = this.root;
        // 获取树下一层
        for (const k in node.children) {
          nextQueue.push(node.children[k]);
        }

        if (parent) {
          let failure: any = parent.failure;
          while (failure) {
            const children: any = failure.children[key];

            // 判断是否到了根节点
            if (children) {
              node.failure = children;
              break;
            }
            failure = failure.failure;
          }
        }
      }

      currQueue = nextQueue;
    }
  }

  /**
   * 搜索节点
   * @param key
   * @param node
   */
  search(key: string, node: Children = this.root.children): Node | undefined {
    return node[key];
  }
}

interface FilterValue {
  text: string;
  pass: boolean;
}

interface EmojiType {
  word: string;
  toWord: string;
}

class Mint extends Tree {
  public keyTable: EmojiType[];

  constructor(keywords: EmojiType[] = []) {
    super();
    this.keyTable = keywords;
    // 创建Trie树
    for (const item of keywords) {
      this.insert(item.word);
    }

    this.createFailureTable();
  }

  /**
   * 筛选方法
   * @param word 文字
   * @param every 验证全部
   * @param replace 是否替换
   */
  private filterFunc(text: string): FilterValue {
    // 字符长度
    const wordLen = text.length;
    if (wordLen <= 0) {
      return {
        text: text || "",
        pass: true,
      };
    }

    // 过滤后的文字
    let filterText = "";

    // 当前树位置
    let currNode: Node | undefined = this.root;
    let nextNode: Node | undefined;

    // 失配路线
    let failure;

    // 是否通过验证
    let isPass = true;

    for (let endIndex = 0; endIndex < wordLen; endIndex++) {
      const key = text[endIndex];
      filterText += key;
      nextNode = this.search(key, currNode.children);
      if (!nextNode) {
        failure = currNode.failure;
        while (failure) {
          nextNode = this.search(key, failure.children);
          if (nextNode) break;
          failure = failure.failure;
        }
      }

      if (nextNode) {
        failure = nextNode;
        do {
          if (failure?.word) {
            isPass = false;
            const len = failure.depth;

            const keyword = filterText.slice(-len);
            let replaceWord = "";

            for (const item of this.keyTable) {
              if (item.word === keyword) {
                replaceWord = item.toWord;
                break;
              }
            }

            filterText = filterText.slice(0, -len) + replaceWord;
          }
          failure = failure?.failure;
        } while (failure?.key !== "root");

        currNode = nextNode;
        continue;
      }
      currNode = this.root;
    }

    return {
      text: filterText,
      pass: isPass,
    };
  }

  /**
   * 过滤方法
   * @param text 文本
   * @param options 选项
   */
  filterSync(text: string): FilterValue {
    return this.filterFunc(text);
  }
}

/**
 * 将正文中的emoji替换为<img>
 * @param text 正文
 * @param emojis emojis数组
 */
export const replaceContentEmoji = (text: string): string => {
  if (!text || text.length === 0) {
    return "";
  }

  if (text.indexOf(":") === -1) {
    return text;
  }

  const hash = useEmojiStore.getState().emojisHash();

  let isEmoji = false;
  let handledText = "";
  let emojiKey = "";
  for (let index = 0; index < text.length; index++) {
    if (text[index] === ":") {
      if (!isEmoji) {
        // emoji开始
        isEmoji = true;
      } else {
        // emoji结束
        isEmoji = false;
        const getEmoji = hash.get(emojiKey);
        if (!getEmoji || getEmoji === undefined) {
          handledText += ":" + emojiKey + ":";
        } else {
          handledText += `<img src="${getEmoji.url}" width="20" height="20" style="margin:2px;vertical-align:middle;display: inline;" />`;
        }
        emojiKey = "";
      }
    } else {
      if (isEmoji) {
        emojiKey += text[index];
      } else {
        handledText += text[index];
      }
    }
  }

  return handledText + emojiKey;
};

/**
 * 将文本中的emoji替换为以类型分类的数组，可以按顺序渲染不同的内容
 * @param text 正文
 * @param emojis emojis数组
 */

export const replaceNameEmoji = (text: string): any[] => {
  if (!text || text.length === 0) {
    return [];
  }

  if (text.indexOf(":") === -1) {
    return [
      {
        text,
        image: false,
      },
    ];
  }

  const hash = useEmojiStore.getState().emojisHash();

  const nameList = text.split(":");
  return nameList.map((name: string) => {
    const getEmoji = hash.get(name);
    if (!getEmoji || getEmoji === undefined) {
      return {
        text: name,
        image: false,
      };
    } else {
      return {
        text: getEmoji.url,
        image: true,
      };
    }
  });
};
