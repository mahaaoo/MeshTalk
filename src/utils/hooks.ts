import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import { Loading } from "react-native-ma-modal";
import { shallow } from "zustand/shallow";

import { RefreshState } from "../components/RefreshList";
import { Account, Relationship, Response } from "../config/interface";
import useAppStore from "../store/useAppStore";
import { getRelationships } from "../server/account";

// 防抖hooks
const useDebounce = (fn: any, delay: number = 1000, dep: any[] = []) => {
  const { current } = useRef<{ fn: any; timer: any }>({ fn, timer: null });
  useEffect(
    function () {
      current.fn = fn;
    },
    [current, fn],
  );

  return useCallback(
    (...args: any) => {
      if (current.timer) {
        clearTimeout(current.timer);
      }
      current.timer = setTimeout(() => {
        current.fn(...args);
      }, delay);
    },
    [current, delay],
  );
};

interface UseRequestOptions {
  manual?: boolean; // 是否需要手动触发
  loading?: boolean;
}

// 请求
// 已废弃
const useRequest = <T>(
  fn: (...args: any) => Promise<T>,
  options: UseRequestOptions = { loading: true, manual: false },
) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState();
  const { current }: any = useRef({ fn });

  const run: (...args: any) => void = useCallback(
    (...args: any) => {
      async function getData() {
        const { data } = await current.fn.call(null, ...args);
        setData(data);
      }
      if (options.loading) {
        Loading.show();
      }

      getData()
        .catch((error) => {
          console.error("useRequest", error.message);
          // Toast.show(error.message);
          setError(error);
        })
        .finally(() => {
          if (options.loading) {
            Loading.hide?.();
          }
        });
    },
    [current.fn, options.loading],
  );

  useEffect(() => {
    current.fn = fn;
    if (options?.manual === false && !data) {
      run();
    }
  }, [current, data, fn, options?.manual, run]);

  return {
    data,
    error,
    run,
  };
};

// 定时器
const useSetTimeout = (
  callback: (...args: any) => void,
  delay: number = 1000,
) => {
  const ref: any = useRef();

  useEffect(() => {
    ref.current = callback;
  });

  useEffect(() => {
    const cb = () => {
      ref.current();
    };
    const timer = setTimeout(cb, delay);
    return () => clearTimeout(timer);
  }, [delay]);
};

// 下拉刷新和上拉加载列表
const useRefreshList = <T>(
  fetchApi: (...args: any) => Response<T[]>, // 请求接口
  loadType: "Normal" | "Link",
  limit: number = 20,
) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [link, setLink] = useState<string>();
  const [listStatus, setListStatus] = useState<RefreshState>(RefreshState.Idle);
  const end = useRef(false);
  const [err, setErr] = useState(false);

  // 直接使用fetchData，如果首页数据不够一屏，会触发loadMore方法，多发一次请求，直接使用onRefresh则没问题
  const fetchData = useCallback(async () => {
    const { data, headers } = await fetchApi({ limit });
    if (data) {
      if (data.length > 0) {
        setDataSource(data);
        if (limit > 0 && data.length < limit) {
          end.current = true;
          setListStatus(RefreshState.NoMoreData);
        } else {
          end.current = false;
          setListStatus(RefreshState.Idle);
        }
        if (loadType === "Link") {
          setLink(headers?.link);
        }
        setErr(false);
      } else {
        // Toast.show("暂时没有数据");
        setErr(true);
        setListStatus(RefreshState.Idle);
      }
    }
    Loading.hide();
  }, [fetchApi, limit, loadType]);

  const onRefresh = async () => {
    setListStatus(RefreshState.HeaderRefreshing);
    await fetchData();
  };

  const onLoadMore = useCallback(async () => {
    if (end.current === false) {
      setListStatus(RefreshState.FooterRefreshing);
      // max_id获取方式和接口有关
      let maxId = "";
      if (loadType === "Normal") {
        // @ts-ignore
        maxId = dataSource[dataSource.length - 1]?.id;
      }
      if (loadType === "Link") {
        const regex = /max_id=(\d+)/;
        const match = link?.match(regex);
        if (match && match.length > 1) {
          maxId = match[1]; // 提取 max_id 的值
        }
      }
      const { data } = await fetchApi({ max_id: maxId, limit });
      if (data) {
        setDataSource(dataSource.concat(data));
        if (limit > 0 && data.length < limit) {
          end.current = true;
          setListStatus(RefreshState.NoMoreData);
        } else {
          setListStatus(RefreshState.Idle);
        }
        setErr(false);
      } else {
        // 请求报错
        setErr(true);
        setListStatus(RefreshState.Idle);
      }
    }
  }, [dataSource, fetchApi, limit, link, loadType]);

  return {
    dataSource,
    listStatus,
    fetchData,
    onRefresh,
    onLoadMore,
    err,
  };
};

// 订阅token
const useSubscribeToken = (fetchApi: any) => {
  useEffect(() => {
    const switchUserSubscribe = useAppStore.subscribe(
      (state) => state.token,
      () => {
        fetchApi();
      },
      {
        equalityFn: shallow,
        fireImmediately: false,
      },
    );
    return switchUserSubscribe;
  }, [fetchApi]);
};

// 获取relationship，基本和批量获取用户信息绑定
const useRelationships = (dataSource: Account[], limit: number) => {
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  const fetchRelationships = async () => {
    if (dataSource.length === 0) return;
    if (dataSource.length > 0 && dataSource.length <= limit) {
      // 一次请求回来的
      const ids = dataSource.map((item) => item.id);
      const { data, ok } = await getRelationships(ids);
      if (ok && data) {
        setRelationships(data);
      }
    } else {
      const ids = dataSource
        .slice(dataSource.length - relationships.length)
        .map((item) => item.id);
      const { data, ok } = await getRelationships(ids);
      if (ok && data) {
        setRelationships(relationships.concat(data));
      }
    }
  };

  useEffect(() => {
    if (dataSource.length > relationships.length) {
      fetchRelationships();
    }
  }, [dataSource, relationships]);

  const mergeDataSource = useMemo(() => {
    if (dataSource.length === relationships.length) {
      return dataSource.map((data, index) => ({
        account: data,
        relationship: relationships[index],
      }));
    }
    return [];
  }, [dataSource, relationships]);

  return {
    mergeDataSource,
  };
};

export {
  useDebounce,
  useRequest,
  useSetTimeout,
  useRefreshList,
  useSubscribeToken,
  useRelationships,
};
