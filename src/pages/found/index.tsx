import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MyTabBar} from '../../components';

import {Screen} from '../../config';
import Local from './local';
import Public from './public';

const Found: React.FC<{}> = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.main, {paddingTop: insets.top}]}>
      {/* <ScrollableTabView
        style={styles.tabView}
        renderTabBar={() => <MyTabBar />}>
        <Local tabLabel="本站" />
        <Public tabLabel="跨站" />
      </ScrollableTabView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: Screen.width,
    backgroundColor: '#fff',
  },
  tabView: {
    flex: 1,
    backgroundColor: '#fff',
    width: Screen.width,
  },
});

export default Found;
