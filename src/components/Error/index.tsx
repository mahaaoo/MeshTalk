import React from 'react';
import {View} from 'react-native';

const Assets = {
  NORESULT: require("../../images/NO_RESULT.png"),
  NoLike: require("../../images/NO_LIKE.png"),
  NoNotify: require("../../images/NO_NOTIFY.png"),
  NoData: require("../../images/NO_DATA.png"),
}

const enum ErrorType {
  NoResult,
  NoLike,
  NoNotify,
  NoData,
}

interface ErrorProps {

};

const Error: React.FC<ErrorProps> = props => {
  const {} = props;

  return (
    <View />
  )
};

export default Error;
