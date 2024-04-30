import React from 'react';
import {View} from 'react-native';
import Colors from '../../config/colors';

interface SpacingBoxProps {
  height?: number;
  color?: string;
  width?: number;
}

const SpacingBox: React.FC<SpacingBoxProps> = props => {
  const {height, color = Colors.defaultWhite, width} = props;
  return (
    <View style={{width: width, height: height, backgroundColor: color}} />
  );
};

export default SpacingBox;
