import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';

import {Timelines} from '../../config/interface';
import {localLine} from '../../server/timeline';
import {useRequest} from '../../utils';
import {Colors} from '../../config';

import {RefreshList, RefreshState} from '../../components';
import HomeLineItem from '../home/homelineItem';
import DefaultLineItem from '../home/defaultLineItem';

const fetchLocalLine = () => {
  const fn = (params: string) => {
    return localLine(params);
  };
  return fn;
};

interface LocalProps {
  tabLabel: string;
}

const Local: React.FC<LocalProps> = props => {
  const [listData, setListData] = useState<Timelines[]>([]);
  const [status, setStatus] = useState<RefreshState>(RefreshState.Idle);

  const {data: localLineData, run: getLocalLineData} = useRequest(
    fetchLocalLine(),
    {manual: true, loading: false},
  );

  const handleRefresh = useCallback(() => {
    setStatus(RefreshState.HeaderRefreshing);
    getLocalLineData();
  }, [status]);

  const handleLoadMore = useCallback(() => {
    setStatus(RefreshState.FooterRefreshing);
    const maxId = listData[listData.length - 1].id;
    getLocalLineData(`&max_id=${maxId}`);
  }, [status, listData]);

  useEffect(() => {
    getLocalLineData();
  }, []);

  useEffect(() => {
    if (localLineData) {
      if (
        status === RefreshState.HeaderRefreshing ||
        status === RefreshState.Idle
      ) {
        setListData(localLineData);
      }
      if (status === RefreshState.FooterRefreshing) {
        setListData(listData.concat(localLineData));
      }
      setStatus(RefreshState.Idle);
    }
  }, [localLineData]);

  return (
    <View style={styles.main}>
      <RefreshList
        data={listData}
        renderItem={({item}) => <HomeLineItem item={item} />}
        onHeaderRefresh={handleRefresh}
        onFooterRefresh={handleLoadMore}
        refreshState={status}
        emptyComponent={<DefaultLineItem />}
        keyExtractor={(item, index) => item?.id || index.toString()}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
});

export default Local;
