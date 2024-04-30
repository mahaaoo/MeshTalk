import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

import SplitLine from '../SplitLine';
import Screen from '../../config/screen';
import Colors from '../../config/colors';
import {Icon} from '../Icon';

interface ListRowProps {
  title: string;

  leftIcon?: React.ReactNode;
  rightView?: React.ReactNode;
  rightIcon?: React.ReactNode;

  onPress?: () => void;
  height?: number;
  canClick?: boolean;
}

const renderLeft = (props: ListRowProps) => {
  const {leftIcon} = props;
  if (!leftIcon || leftIcon === null) {
    return <View />;
  }
  return <View style={styles.leftIcon}>{leftIcon}</View>;
};

const renderRight = (props: ListRowProps) => {
  const {rightView} = props;
  if (!rightView || rightView === null) {
    return <View />;
  }
  return <View style={styles.rightContainer}>{rightView}</View>;
};

const renderRightIcon = (props: ListRowProps) => {
  const {rightIcon = <Icon name={'arrowRight'} size={18} color={'#333'} />} =
    props;
  if (!rightIcon || rightIcon === null) {
    return <View />;
  }
  return rightIcon;
};

const ListRow: React.FC<ListRowProps> = props => {
  const {title, height = 55, onPress, canClick = true} = props;
  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            height: height,
          },
        ]}
        onPress={() => {
          canClick ? onPress && onPress() : null;
        }}
        activeOpacity={canClick ? 0.2 : 1}>
        <View style={styles.extendContainer}>
          {renderLeft(props)}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.extendContainer}>
          {renderRight(props)}
          {renderRightIcon(props)}
        </View>
      </TouchableOpacity>
      <SplitLine start={0} end={Screen.width} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.defaultWhite,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  extendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  leftIcon: {
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rightContainer: {
    marginRight: 10,
  },
});

export default ListRow;
