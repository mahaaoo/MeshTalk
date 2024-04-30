import React, {useCallback} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';

import {Screen, Colors} from '../../config';
import {Card} from '../../config/interface';
import {navigate} from '../../utils';

interface WebCardProps {
  card: Card;
}

const WebCard: React.FC<WebCardProps> = props => {
  const {card} = props;

  const handleNavigation = useCallback(() => {
    navigate('Link', {
      url: card.url,
    });
  }, []);

  if (!card || !card.image) {
    return null;
  }

  return (
    <TouchableOpacity onPress={handleNavigation} style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: card?.image,
        }}
        resizeMode={'cover'}
      />
      <View style={styles.content}>
        <View style={styles.cardContainer}>
          <Text numberOfLines={1} style={styles.cardText}>
            {card?.title}
          </Text>
        </View>
        <View style={styles.desContainer}>
          <Text ellipsizeMode={'tail'} numberOfLines={3} style={styles.desText}>
            {card?.description}
          </Text>
        </View>
        <View style={styles.urlContainer}>
          <Text numberOfLines={1} style={{color: Colors.grayTextColor}}>
            {card?.url}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: Screen.onePixel,
    borderColor: Colors.defaultLineGreyColor,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 15,
    height: 110,
  },
  image: {
    flex: 1,
  },
  content: {
    flex: 2,
  },
  cardContainer: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  desContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  desText: {
    lineHeight: 17,
  },
  urlContainer: {
    marginHorizontal: 8,
    marginVertical: 5,
  },
});

export default WebCard;
