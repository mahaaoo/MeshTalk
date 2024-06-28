import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { styles } from "./index.style";
import { Icon } from "../../components";
import { Colors } from "../../config";
import { favouriteStatuses, unfavouriteStatuses, reblog, unreblog } from "../../server/status";
import { addBookmark, deleteBookmark } from "../../server/account";

import { Timelines } from "../../config/interface";
import { systemShare } from "@utils/media";

interface ToolBarProps {
  item: Timelines;
}

const ToolBar: React.FC<ToolBarProps> = (props) => {
  const {
    item,
  } = props;
  const {
    favourited = false,
    favourites_count = 0,
    reblogs_count = 0,
    replies_count = 0,
    id,
    reblogged = false,
    bookmarked = false,
    url,
  } = item;
  const [isReblog, setIsReblog] = useState(reblogged);
  const [reblogCount, setReblogCount] = useState(reblogs_count);

  const [isFavourited, setIsFavourited] = useState(favourited);
  const [favouritesCount, setFavouritesCount] = useState(favourites_count);

  const [isBookmark, setIsBookmark] = useState(bookmarked);
  
  // 转发和取消转发
  const handleReblog = useCallback(async () => {
    if (isReblog) {
      setIsReblog(false);
      setReblogCount(reblogCount - 1);
      const { ok } = await unreblog(id);
      if (!ok) {
        setIsReblog(true);
        setReblogCount(reblogCount + 1);
      }
    } else {
      setIsReblog(true);
      setReblogCount(reblogCount + 1);
      const { ok } = await reblog(id);
      if (!ok) {
        setIsReblog(false);
        setReblogCount(reblogCount - 1);
      }
    }
  }, [isReblog, reblogCount]);

  // TODO: 将此类型的操作，抽象成一个hook单独使用
  // 即先改变UI，在经过防抖处理之后，再去调用实际的api，请求成功则不处理，如果失败则UI回退
  const handleLike = useCallback(async () => {
    if (isFavourited) {
      setIsFavourited(false);
      setFavouritesCount(favouritesCount - 1);
      const { ok } = await unfavouriteStatuses(id);
      if (!ok) {
        setIsFavourited(true);
        setFavouritesCount(favouritesCount + 1);
      }
    } else {
      setIsFavourited(true);
      setFavouritesCount(favouritesCount + 1);
      const { ok } = await favouriteStatuses(id);
      if (!ok) {
        setIsFavourited(false);
        setFavouritesCount(favouritesCount - 1);
      }
    }
  }, [isFavourited, favouritesCount, id]);

  const handleBookmark = useCallback(async () => {
    if (isBookmark) {
      setIsBookmark(false);
      const { ok } = await addBookmark(id);
      if (!ok) {
        setIsBookmark(true);
      }
    } else {
      setIsBookmark(true);
      const { ok } = await deleteBookmark(id);
      if (!ok) {
        setIsBookmark(false);
      }
    }
  }, [isBookmark, id]);

  const handleShare = useCallback(() => {
    systemShare(url)
  }, [url])

  return (
    <View style={styles.tool}>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem} onPress={handleReblog}>
          <Icon
            name="turn"
            size={20}
            color={isReblog ? "green" : Colors.commonToolBarText}
          />
          <Text
            style={[
              styles.toolTitle,
              { color: isReblog ? "green" : Colors.commonToolBarText },
            ]}
          >
            {reblogCount <= 0
              ? ""
              : reblogCount}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem}>
          <Icon name="comment" size={20} color={Colors.commonToolBarText} />
          <Text style={styles.toolTitle}>
            {replies_count <= 0
              ? ""
              : replies_count}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem} onPress={handleLike}>
        <Icon name={!isFavourited ? "like" : "likeFill"} size={23} color={!isFavourited ? Colors.commonToolBarText : "red"} />
          <Text
            style={[
              styles.toolTitle,
              { color: !isFavourited ? Colors.commonToolBarText : "red" },
            ]}
          >
            {favouritesCount <= 0
              ? ""
              : favouritesCount}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolItem}>
        <TouchableOpacity style={styles.toolItem} onPress={handleBookmark}>
          <Icon name={isBookmark ? "bookmarkFill" : "bookmark"} size={18} color={isBookmark ?  "orange" : Colors.commonToolBarText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolItem} onPress={handleShare}>
          <Icon name={"share"} size={20} color={Colors.commonToolBarText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToolBar;
