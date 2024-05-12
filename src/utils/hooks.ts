import { useRef, useEffect, useCallback, useState } from "react";
import { Loading, Toast } from "react-native-ma-modal";

import { RefreshState } from "../components/RefreshList";
import { Response } from "../config/interface";

// 防抖hooks
const useDebounce = <T extends () => void>(
  fn: T,
  delay: number = 1000,
  dep: any[] = [],
) => {
  const { current }: any = useRef({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback(() => {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn();
    }, delay);
  }, dep);
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
          Toast.show(error.message);
          setError(error);
        })
        .finally(() => {
          if (options.loading) {
            Loading.hide?.();
          }
        });
    },
    [fn],
  );

  useEffect(() => {
    current.fn = fn;
    if (options?.manual === false && !data) {
      run();
    }
  }, [fn]);

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
  }, []);
};

// 下拉刷新和上拉加载列表
const useRefreshList = <T extends { id: string }>(
  fetchApi: (...args) => Response<T[]>, // 请求接口
  loadType: "Normal" | "Link",
  limit: number = 20,
) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [link, setLink] = useState<string>();
  const [listStatus, setListStatus] = useState<RefreshState>(RefreshState.Idle);
  const [end, setEnd] = useState(false);
  const [err, setErr] = useState(false);

  // 直接使用fetchData，如果首页数据不够一屏，会触发loadMore方法，多发一次请求，直接使用onRefresh则没问题
  const fetchData = async () => {
    // setListStatus(RefreshState.Idle);
    const { data, headers } = await fetchApi({ limit });
    if (data) {
      if (data.length > 0) {
        setDataSource(data);
        if (limit > 0 && data.length < limit) {
          setEnd(true);
          setListStatus(RefreshState.NoMoreData);
        } else {
          setEnd(false);
          setListStatus(RefreshState.Idle);
        }

        if (loadType === "Link") {
          setLink(headers.link);
        }
      } else {
        Toast.show("暂时没有数据");
        setErr(true);
        setListStatus(RefreshState.Idle);
      }
    }
  };

  const onRefresh = async () => {
    setListStatus(RefreshState.HeaderRefreshing);
    await fetchData();
  };

  const onLoadMore = useCallback(async () => {
    if (!end) {
      setListStatus(RefreshState.FooterRefreshing);
      // max_id获取方式和接口有关
      let maxId = "";
      if (loadType === "Normal") {
        maxId = dataSource[dataSource.length - 1].id;
      }
      if (loadType === "Link") {
        const regex = /max_id=(\d+)/;
        const match = link.match(regex);
        if (match && match.length > 1) {
          maxId = match[1]; // 提取 max_id 的值
        }
      }
      const { data } = await fetchApi({ max_id: maxId, limit });
      if (data) {
        setDataSource(dataSource.concat(data));
        if (limit > 0 && data.length < limit) {
          setEnd(true);
          setListStatus(RefreshState.NoMoreData);
        } else {
          setListStatus(RefreshState.Idle);
        }
      } else {
        // 请求报错
        setErr(true);
        setListStatus(RefreshState.Idle);
      }
    }
  }, [dataSource, end, link]);

  return {
    dataSource,
    listStatus,
    fetchData,
    onRefresh,
    onLoadMore,
    err,
  };
};

export { useDebounce, useRequest, useSetTimeout, useRefreshList };
