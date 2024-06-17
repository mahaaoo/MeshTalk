import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";

import Colors from "../../config/colors";
import { Relationship } from "../../config/interface";
import {
  followById,
  getRelationships,
  unfollowById,
} from "../../server/account";
import useI18nStore from "../../store/useI18nStore";

export enum FollowButtonStatus {
  UnFollow, // 关注
  Following, // 正在关注
  BothFollow, // 互相关注
  LockFollowRequest, // 请求关注锁推账号
  Requesting, // 正在请求
}

interface FollowButtonProps {
  id: string;
  locked: boolean; // 是否已锁定
}

const FollowButton: React.FC<FollowButtonProps> = (props) => {
  const { id, locked } = props;
  const { i18n } = useI18nStore();
  // 获取上一次渲染的组件样式
  const prevContentRef: any = useRef();
  const [buttonStatus, setButtonStatus] = useState(
    FollowButtonStatus.Requesting,
  );

  // 每次渲染都执行，由于useEffect在Render之后执行，所以当前的prevContentRef.current为上一次的状态
  useEffect(() => {
    prevContentRef.current = content;
  });

  useEffect(() => {
    const fetchRelation = async () => {
      const { data, ok } = await getRelationships(id);
      if (ok && data) {
        handleRelate(data[0]);
      }
    };

    fetchRelation();
  }, [id]);

  const handleRelate = useCallback((relationship: Relationship) => {
    const followedBy = relationship?.followed_by;
    const following = relationship?.following;
    const requested = relationship?.requested; // 关注lock账号，显示请求中

    if (locked && requested) {
      return setButtonStatus(FollowButtonStatus.LockFollowRequest);
    }
    if (!followedBy && !following) {
      // 既没有关注他、也没有被他关注
      return setButtonStatus(FollowButtonStatus.UnFollow);
    }
    if (followedBy && !following) {
      // 他是你的粉丝
      return setButtonStatus(FollowButtonStatus.UnFollow);
    }
    if (!followedBy && following) {
      // 仅仅关注他了
      return setButtonStatus(FollowButtonStatus.Following);
    }
    if (followedBy && following) {
      // 既关注 他、也被他关注、互关好友
      return setButtonStatus(FollowButtonStatus.BothFollow);
    }
  }, []);

  const prevCount = prevContentRef.current;

  const content = useMemo(() => {
    // 当点击按钮发起请求的时候，保持Button当前状态，根据当前状态显示出不一样颜色的等待视图
    if (buttonStatus === FollowButtonStatus.Requesting) {
      return (
        prevCount || {
          buttonText: i18n.t("follow_button_requesting"),
          buttonStyle: {
            backgroundColor: Colors.defaultWhite,
            borderColor: Colors.theme,
          },
          textStyle: {
            color: Colors.theme,
            fontSize: 18,
          },
          indicatorColor: Colors.theme,
        }
      );
    }
    switch (true) {
      case buttonStatus === FollowButtonStatus.UnFollow: {
        return {
          buttonText: locked
            ? i18n.t("follow_button_request_follow")
            : i18n.t("follow_button_follow"),
          buttonStyle: {
            backgroundColor: Colors.defaultWhite,
            borderColor: Colors.theme,
          },
          textStyle: {
            color: Colors.theme,
            fontSize: 18,
          },
          indicatorColor: Colors.theme,
        };
      }
      case buttonStatus === FollowButtonStatus.Following: {
        return {
          buttonText: i18n.t("follow_button_following"),
          buttonStyle: {
            backgroundColor: Colors.theme,
            borderColor: Colors.theme,
          },
          textStyle: {
            color: Colors.defaultWhite,
            fontSize: 16,
          },
          indicatorColor: Colors.defaultWhite,
        };
      }
      case buttonStatus === FollowButtonStatus.BothFollow: {
        return {
          buttonText: i18n.t("follow_button_mutual"),
          buttonStyle: {
            backgroundColor: Colors.theme,
            borderColor: Colors.theme,
          },
          textStyle: {
            color: Colors.defaultWhite,
            fontSize: 16,
          },
          indicatorColor: Colors.defaultWhite,
        };
      }
      case buttonStatus === FollowButtonStatus.LockFollowRequest: {
        return {
          buttonText: i18n.t("follow_button_waiting"),
          buttonStyle: {
            backgroundColor: Colors.theme,
            borderColor: Colors.theme,
          },
          textStyle: {
            color: Colors.defaultWhite,
            fontSize: 16,
          },
          indicatorColor: Colors.defaultWhite,
        };
      }
    }
  }, [buttonStatus, locked, i18n]);

  const handleOnPress = useCallback(async () => {
    if (buttonStatus === FollowButtonStatus.UnFollow) {
      setButtonStatus(FollowButtonStatus.Requesting);
      const { data, ok } = await followById(id);
      if (ok && data) {
        handleRelate(data);
      }
    }
    if (
      buttonStatus === FollowButtonStatus.Following ||
      buttonStatus === FollowButtonStatus.BothFollow
    ) {
      setButtonStatus(FollowButtonStatus.Requesting);
      const { data, ok } = await unfollowById(id);
      if (ok && data) {
        handleRelate(data);
      }
    }
    if (buttonStatus === FollowButtonStatus.LockFollowRequest) {
      setButtonStatus(FollowButtonStatus.Requesting);
      // TODO: 添加一个是否确认取消关注申请的alert
      const { data, ok } = await unfollowById(id);
      if (ok && data) {
        handleRelate(data);
      }
    }
  }, [buttonStatus, id]);

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={[styles.outView, content.buttonStyle, {}]}>
        {buttonStatus === FollowButtonStatus.Requesting ? (
          <ActivityIndicator animating color={content.indicatorColor} />
        ) : (
          <Text style={[{ textAlignVertical: "center" }, content.textStyle]}>
            {content.buttonText}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outView: {
    justifyContent: "center",
    alignItems: "center",
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
});

export default FollowButton;
