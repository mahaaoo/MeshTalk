import { Screen } from "@components";
import ServerCard from "@ui/welcome/serverCard";
import { useLocalSearchParams } from "expo-router";
import React from "react";

import { MastodonServers } from "../../config/interface";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";

interface ServerDetailProps {}

const ServerDetail: React.FC<ServerDetailProps> = () => {
  const { server = "" } = useLocalSearchParams<{ server: string }>();
  const serverObject = JSON.parse(server) as MastodonServers;
  const { height, width } = useDeviceStore();
  const { i18n } = useI18nStore();

  return (
    <Screen headerShown title={i18n.t("page_server_detail_title")}>
      <ServerCard
        server={serverObject}
        height={height * 0.6}
        width={width * 0.8}
      />
    </Screen>
  );
};

export default ServerDetail;
