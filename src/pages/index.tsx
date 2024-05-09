import { NativeStackScreenProps } from "@react-navigation/native-stack";

import UserFans from "./fans/userFans";
import UserFollow from "./fans/userFollow";
import Guide from "./guide";
import Link from "./link";
import Login from "./login";
import Publish from "./publish";
import Recommand from "./recommand";
import Favourites from "./setting/favourites";
import StatusDetail from "./statusDetail";
import User from "./user";
import WebView from "./webView";
import { Account } from "../config/interface";

export type RouterProps<T extends keyof StackParams> = NativeStackScreenProps<
  StackParams,
  T
>;

export type StackParams = {
  App: undefined;
  Guide: undefined;
  Login: undefined;
  WebView: {
    initUrl: string;
    callBack: (code: string) => void;
  };
  User: {
    account: Account;
  };
  UserFans: {
    id: string;
  };
  UserFollow: {
    id: string;
  };
  StatusDetail: {
    id: string;
  };
  Publish: undefined;
  Favourites: undefined;
  Link: {
    url: string;
  };
  Recommand: undefined;
};

export interface RouteParams {
  name: keyof StackParams;
  component: React.ComponentType<any>;
  options?: any;
}

const routes: RouteParams[] = [
  {
    name: "Guide",
    component: Guide,
    options: {
      header: () => null,
    },
  },
  {
    name: "Recommand",
    component: Recommand,
    options: {
      title: "推荐社区",
    },
  },
  {
    name: "Login",
    component: Login,
    options: {
      header: () => null,
    },
  },
  {
    name: "WebView",
    component: WebView,
  },
  {
    name: "User",
    component: User,
    options: {
      header: () => null,
    },
  },
  {
    name: "UserFans",
    component: UserFans,
    options: {
      title: "粉丝",
    },
  },
  {
    name: "UserFollow",
    component: UserFollow,
    options: {
      title: "正在关注",
    },
  },
  {
    name: "StatusDetail",
    component: StatusDetail,
    options: {
      title: "嘟文详情",
    },
  },
  {
    name: "Favourites",
    component: Favourites,
    options: {
      title: "我的喜欢",
    },
  },
  {
    name: "Link",
    component: Link,
    options: {
      title: "详情",
    },
  },
  {
    name: "Publish",
    component: Publish,
    options: {
      title: "发送嘟文",
      animation: "slide_from_bottom",
    },
  },
];

const unLoginRoute: RouteParams[] = [
  {
    name: "Guide",
    component: Guide,
    options: {
      header: () => null,
    },
  },
  {
    name: "Login",
    component: Login,
    options: {
      header: () => null,
    },
  },
  {
    name: "WebView",
    component: WebView,
  },
  {
    name: "Recommand",
    component: Recommand,
    options: {
      title: "推荐社区",
    },
  },
]

export { routes, unLoginRoute };
