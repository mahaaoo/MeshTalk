import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';

import {Timelines} from '../../config/interface';
import {publicLine} from '../../server/timeline';
import {useRequest} from '../../utils/hooks';
import {RefreshList, RefreshState} from '../../components';
import {Colors} from '../../config';

import DefaultLineItem from '../home/defaultLineItem';
import HomeLineItem from '../home/homelineItem';

const fetchPublicLine = () => {
  const fn = (params: string) => {
    return publicLine(params);
  };
  return fn;
};

interface PublicProps {
  tabLabel: string;
}

const Public: React.FC<PublicProps> = () => {
  const [listData, setListData] = useState<Timelines[]>([]);
  const [status, setStatus] = useState<RefreshState>(RefreshState.Idle);

  const {data: publicLineData, run: getPublicLineData} = useRequest(
    fetchPublicLine(),
    {manual: true, loading: false},
  );

  const handleRefresh = useCallback(() => {
    setStatus(RefreshState.HeaderRefreshing);
    getPublicLineData();
  }, [status]);

  const handleLoadMore = useCallback(() => {
    setStatus(RefreshState.FooterRefreshing);
    const maxId = listData[listData.length - 1].id;
    getPublicLineData(`?max_id=${maxId}`);
  }, [status, listData]);

  useEffect(() => {
    getPublicLineData();
  }, []);

  useEffect(() => {
    if (publicLineData) {
      if (
        status === RefreshState.HeaderRefreshing ||
        status === RefreshState.Idle
      ) {
        setListData(publicLineData);
      }
      if (status === RefreshState.FooterRefreshing) {
        setListData(listData.concat(publicLineData));
      }
      setStatus(RefreshState.Idle);
    }
  }, [publicLineData]);

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

export default Public;
