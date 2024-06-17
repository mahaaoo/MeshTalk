import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { styles } from "./index.style";
import { Icon } from "../../components";
import { Colors } from "../../config";
import { favouriteStatuses, unfavouriteStatuses } from "../../server/status";
import useI18nStore from "../../store/useI18nStore";

interface ToolBarProps {
  favourited?: boolean;
  favourites_count?: number;
  reblogged?: boolean;
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
    reblogged = false,
  } = props;
  const { i18n } = useI18nStore();
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
          <Icon
            name="turn"
            size={20}
            color={reblogged ? "green" : Colors.commonToolBarText}
          />
          <Text
            style={[
              styles.toolTitle,
              { color: reblogged ? "green" : Colors.commonToolBarText },
            ]}
          >
            {reblogs_count === 0
              ? i18n.t("status_tool_bar_turn")
              : reblogs_count}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem}>
          <Icon name="comment" size={20} color={Colors.commonToolBarText} />
          <Text style={styles.toolTitle}>
            {replies_count === 0
              ? i18n.t("status_tool_bar_comment")
              : replies_count}
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
          <Text
            style={[
              styles.toolTitle,
              { color: !isFavourited ? Colors.commonToolBarText : "red" },
            ]}
          >
            {favouritesCount === 0
              ? i18n.t("status_tool_bar_like")
              : favouritesCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToolBar;
