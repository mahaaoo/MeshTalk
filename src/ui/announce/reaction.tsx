import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Toast } from "react-native-ma-modal";

import { Colors } from "../../config";
import { AnnouncementReaction } from "../../config/interface";
import { addReaction, deleteReaction } from "../../server/notifications";

interface ReactionProps {
  reaction: AnnouncementReaction;
  announceId: string;
}

const Reaction: React.FC<ReactionProps> = (props) => {
  const { reaction, announceId } = props;
  const [isAdd, setIsAdd] = useState(reaction.me);
  const [count, setCount] = useState(reaction.count);
  const loading = useRef<boolean>(false);

  // 在发起请求前修改UI，请求失败之后再重置回来
  const handleClick = async () => {
    if (loading.current) return;
    if (isAdd) {
      // 取消点赞
      setIsAdd(false);
      setCount(count - 1);
      loading.current = true;
      const { ok } = await deleteReaction(announceId, reaction.name);
      if (!ok) {
        setIsAdd(true);
        setCount(count + 1);
        Toast.show("取消反馈失败");
      }
      loading.current = false;
    } else {
      // 点赞
      setIsAdd(true);
      setCount(count + 1);
      loading.current = true;
      const { ok } = await addReaction(announceId, reaction.name);
      if (!ok) {
        setIsAdd(false);
        setCount(count - 1);
        Toast.show("添加反馈失败");
      }
      loading.current = false;
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      style={[
        styles.readItem,
        {
          backgroundColor: isAdd ? Colors.defaultLineGreyColor : "#fff",
        },
      ]}
    >
      {reaction.url && reaction.url.length > 0 ? (
        <Image
          source={{
            uri: reaction.url,
          }}
          style={{ width: 25, height: 25 }}
        />
      ) : (
        <Text style={{ fontSize: 20 }}>{reaction.name}</Text>
      )}
      <Text
        style={{
          fontSize: 16,
          marginLeft: 5,
          color: isAdd ? "green" : "#333",
        }}
      >
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  readItem: {
    flexDirection: "row",
    padding: 5,
    margin: 5,
    borderWidth: 1,
    borderColor: Colors.defaultLineGreyColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});

export default Reaction;
