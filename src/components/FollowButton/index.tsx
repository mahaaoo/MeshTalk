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
} from "react-native";

import Colors from "../../config/colors";
import { Relationship } from "../../config/interface";
import { followById, unfollowById } from "../../server/account";
import { useRequest } from "../../utils/hooks";

export enum FollowButtonStatus {
  UnFollow, // 关注
  Following, // 正在关注
  BothFollow, // 互相关注
  Requesting, // 正在请求
}

const fetchFollowById = (id: string = "") => {
  const fn = () => {
    return followById(id);
  };
  return fn;
};

const fetchUnfollowById = (id: string = "") => {
  const fn = () => {
    return unfollowById(id);
  };
  return fn;
};

interface FollowButtonProps {
  relationships: Relationship[] | undefined;
  id: string;
}

const FollowButton: React.FC<FollowButtonProps> = (props) => {
  const { relationships, id } = props;
  // 获取上一次渲染的组件样式
  const prevContentRef: any = useRef();

  const [buttonStatus, setButtonStatus] = useState(
    FollowButtonStatus.Requesting,
  );
  const [relationship, setRelationship] = useState<Relationship>();

  const { data: followData, run: getFollowById } = useRequest(
    fetchFollowById(id),
    { manual: true, loading: false },
  );
  const { data: unFollowData, run: getUnfollowById } = useRequest(
    fetchUnfollowById(id),
    { manual: true, loading: false },
  );

  // 每次渲染都执行，由于useEffect在Render之后执行，所以当前的prevContentRef.current为上一次的状态
  useEffect(() => {
    prevContentRef.current = content;
  });

  useEffect(() => {
    if (relationships && relationships.length > 0) {
      const newRelationship = relationships.filter((item) => item.id === id)[0];
      setRelationship(newRelationship);
    }
  }, [relationships]);

  useEffect(() => {
    if (followData) {
      setRelationship(followData);
    }
  }, [followData]);

  useEffect(() => {
    if (unFollowData) {
      setRelationship(unFollowData);
    }
  }, [unFollowData]);

  useEffect(() => {
    if (relationship) {
      const followed = relationship?.followed_by;
      const following = relationship?.following;

      if (!followed && !following) {
        // 既没有关注他、也没有被他关注
        setButtonStatus(FollowButtonStatus.UnFollow);
      }
      if (followed && !following) {
        // 他是你的粉丝
        setButtonStatus(FollowButtonStatus.UnFollow);
      }
      if (!followed && following) {
        // 仅仅关注他了
        setButtonStatus(FollowButtonStatus.Following);
      }
      if (followed && following) {
        // 既关注他、也被他关注、互关好友
        setButtonStatus(FollowButtonStatus.BothFollow);
      }
    }
  }, [relationship]);

  const prevCount = prevContentRef.current;

  const content = useMemo(() => {
    // 当点击按钮发起请求的时候，保持Button当前状态，根据当前状态显示出不一样颜色的等待视图
    if (buttonStatus === FollowButtonStatus.Requesting) {
      return (
        prevCount || {
          buttonText: "请求中",
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
          buttonText: "关注",
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
          buttonText: "正在关注",
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
          buttonText: "互相关注",
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
      default: {
        return {
          buttonText: "关注",
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
    }
  }, [buttonStatus]);

  const handleOnPress = useCallback(() => {
    if (buttonStatus === FollowButtonStatus.UnFollow) {
      getFollowById();
    }
    if (
      buttonStatus === FollowButtonStatus.Following ||
      buttonStatus === FollowButtonStatus.BothFollow
    ) {
      getUnfollowById();
    }
    setButtonStatus(FollowButtonStatus.Requesting);
  }, [buttonStatus]);

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={[styles.outView, content.buttonStyle]}
    >
      {buttonStatus === FollowButtonStatus.Requesting ? (
        <ActivityIndicator
          animating={buttonStatus === FollowButtonStatus.Requesting}
          color={content.indicatorColor}
        />
      ) : (
        <Text style={content.textStyle}>{content.buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outView: {
    padding: 15,
    backgroundColor: Colors.buttonDefaultBackground,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    width: 100,
  },
});

export default FollowButton;
