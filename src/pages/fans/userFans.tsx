import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';

import {RefreshList, RefreshState} from '../../components';
import {getFollowersById} from '../../server/account';
import {useRequest} from '../../utils';

import {Account} from '../../config/interface';
import {Colors, Screen} from '../../config';

import {RouterProps} from '../index';
import UserItem from './userItem';

const fetchFollowersById = (id: string) => {
  const fn = (param: string) => {
    return getFollowersById(id, param);
  };
  return fn;
};

interface UserFansProps extends RouterProps<'UserFans'> {}

const UserFans: React.FC<UserFansProps> = props => {
  const {id} = props?.route?.params;
  const {data: followers, run: getFollowers} = useRequest(
    fetchFollowersById(id),
    {manual: false, loading: true},
  );

  const [dataSource, setDataSource] = useState<Account[]>([]);
  const [listStatus, setListStatus] = useState<RefreshState>(RefreshState.Idle);

  useEffect(() => {
    if (followers) {
      if (
        listStatus === RefreshState.HeaderRefreshing ||
        listStatus === RefreshState.Idle
      ) {
        setDataSource(followers);
      }
      if (listStatus === RefreshState.FooterRefreshing) {
        const maxId = dataSource[0]?.id;
        if (dataSource[0].id < maxId) {
          setDataSource(listData => listData.concat(followers));
        }
      }
      setListStatus(RefreshState.Idle);
    }
  }, [followers]);

  const handleLoadMore = useCallback(() => {
    setListStatus(RefreshState.FooterRefreshing);
    const maxId = dataSource[dataSource.length - 1]?.id;
    getFollowers(`?max_id=${maxId}`);
  }, []);

  const handleRefresh = useCallback(() => {
    setListStatus(RefreshState.HeaderRefreshing);
    getFollowers();
  }, []);

  return (
    <View style={styles.main}>
      <RefreshList
        showsVerticalScrollIndicator={false}
        style={styles.refreshList}
        data={dataSource}
        renderItem={({item}) => <UserItem item={item} />}
        onHeaderRefresh={handleRefresh}
        onFooterRefresh={handleLoadMore}
        scrollEventThrottle={1}
        refreshState={listStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.pageDefaultBackground,
  },
  refreshList: {
    flex: 1,
    width: Screen.width,
  },
});

export default UserFans;
