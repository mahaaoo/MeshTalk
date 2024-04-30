import React from 'react';
import {StyleSheet} from 'react-native';
import Web from 'react-native-webview';

import {RouterProps} from '../index';

interface LinkParams extends RouterProps<'Link'> {}

const Link: React.FC<LinkParams> = props => {
  const {url} = props?.route?.params;
  return <Web style={styles.container} source={{uri: url}} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Link;
