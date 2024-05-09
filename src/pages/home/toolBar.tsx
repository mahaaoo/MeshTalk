import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Icon } from "../../components";
import { Colors } from "../../config";
import { favouriteStatuses, unfavouriteStatuses } from "../../server/status";

interface ToolBarProps {
  favourited?: boolean;
  favourites_count?: number;
  reblogs_count?: number;
  replies_count?: number;
  id: string;
}

const ToolBar: React.FC<ToolBarProps> = (props) => {
  const {
    favourited = false,
    favourites_count = 0,
    reblogs_count = 0,
    replies_count = 0,
    id,
  } = props;

  const [isFavourited, setIsFavourited] = useState(favourited);
  const [favouritesCount, setFavouritesCount] = useState(favourites_count);

  const handleLike = useCallback(async () => {
    if (isFavourited) {
      const { ok } = await unfavouriteStatuses(id);
      if (ok) {
        setIsFavourited(!isFavourited);
        setFavouritesCount(favouritesCount - 1);
      }
    } else {
      const { ok } = await favouriteStatuses(id);
      if (ok) {
        setIsFavourited(!isFavourited);
        setFavouritesCount(favouritesCount + 1);
      }
    }
  }, [isFavourited, favouritesCount]);

  return (
    <View style={styles.tool}>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem}>
          <Icon name="turn" size={20} color={Colors.commonToolBarText} />
          <Text style={styles.toolTitle}>
            {reblogs_count === 0 ? "转发" : reblogs_count}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem}>
          <Icon name="comment" size={20} color={Colors.commonToolBarText} />
          <Text style={styles.toolTitle}>
            {replies_count === 0 ? "转评" : replies_count}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem} onPress={handleLike}>
          {!isFavourited ? (
            <Icon name="like" size={23} color={Colors.commonToolBarText} />
          ) : (
            <Icon name="likeFill" size={23} color="red" />
          )}
          <Text style={styles.toolTitle}>
            {favouritesCount === 0 ? "赞" : favouritesCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tool: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
  },
  toolItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  toolTitle: {
    fontSize: 16,
    color: Colors.commonToolBarText,
    marginLeft: 2,
  },
  iconTurn: {
    width: 24,
    height: 22,
  },
});

export default ToolBar;
