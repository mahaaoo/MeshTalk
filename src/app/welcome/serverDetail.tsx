import { Screen } from "@components";
import ServerCard from "@ui/welcome/serverCard";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";

import { MastodonServers } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";

interface ServerDetailProps {}

const ServerDetail: React.FC<ServerDetailProps> = (props) => {
  const { server = "" } = useLocalSearchParams<{ server: string }>();
  const serverObject = JSON.parse(server) as MastodonServers;
  const { height, width } = useDeviceStore();
  const { i18n } = useI18nStore();

  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(({ x, y }) => {
      rotateX.value = withTiming(
        interpolate(y, [0, 300], [10, -10], Extrapolation.CLAMP),
      );
      rotateY.value = withTiming(
        interpolate(x, [0, 450], [-10, 10], Extrapolation.CLAMP),
      );
    })
    .onUpdate(({ x, y }) => {
      rotateX.value = interpolate(y, [0, 300], [10, -10], Extrapolation.CLAMP);
      rotateY.value = interpolate(x, [0, 450], [-10, 10], Extrapolation.CLAMP);
    })
    .onFinalize(() => {
      rotateX.value = withSpring(0);
      rotateY.value = withSpring(0);
    });

  const animation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          perspective: 300,
        },
        {
          rotateX: `${rotateX.value}deg`,
        },
        {
          rotateY: `${rotateY.value}deg`,
        },
      ],
    };
  });

  return (
    <Screen headerShown title={i18n.t("page_server_detail_title")}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <GestureDetector gesture={gesture}>
          <Animated.View style={[animation]}>
            <ServerCard
              server={serverObject}
              height={height * 0.6}
              width={width * 0.8}
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </Screen>
  );
};

export default ServerDetail;
