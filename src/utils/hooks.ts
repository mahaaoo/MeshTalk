import { useRef, useEffect, useCallback, useState } from "react";
import { Loading, Toast } from "react-native-ma-modal";

import { RefreshState } from "../components/RefreshList";
import { Timelines } from "../config/interface";

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
        setData(await current.fn.call(null, ...args));
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

const useRefreshList = <T extends { id: string }>(
  fetchApi: (...args) => Promise<T[]>, // 请求接口
  limit?: number, // 列表每次请求的数量
) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [listStatus, setListStatus] = useState<RefreshState>(RefreshState.Idle);
  const [end, setEnd] = useState(false);

  const fetchData = async () => {
    const data = await fetchApi();
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
      } else {
        Toast.show("暂时没有数据");
        setListStatus(RefreshState.Idle);
      }
    }
  };

  const onRefresh = () => {
    setListStatus(RefreshState.HeaderRefreshing);
    fetchData();
  };

  const onLoadMore = useCallback(async () => {
    if (!end) {
      setListStatus(RefreshState.FooterRefreshing);
      const maxId = dataSource[dataSource.length - 1].id;
      const data = await fetchApi({ max_id: maxId, limit });
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
      }
    }
  }, [dataSource, end]);

  return {
    dataSource,
    listStatus,
    fetchData,
    onRefresh,
    onLoadMore,
  };
};

export { useDebounce, useRequest, useSetTimeout, useRefreshList };
