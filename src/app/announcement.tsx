import { Screen } from "@components";
import AnnounceCard from "@ui/announce/announceCard";
import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, ActivityIndicator } from "react-native";

import { Colors } from "../config";
import { AnnouncementInterface } from "../config/interface";
import { announcements } from "../server/notifications";
import useDeviceStore from "../store/useDeviceStore";
import useI18nStore from "../store/useI18nStore";

interface AnnouncementProps {}

const Announcement: React.FC<AnnouncementProps> = (props) => {
  const { i18n } = useI18nStore();
  const [announcement, setAnnouncements] = useState<AnnouncementInterface[]>(
    [],
  );
  const { width } = useDeviceStore();
  useEffect(() => {
    const fetch = async () => {
      const { data, ok } = await announcements();
      if (data && ok) {
        setAnnouncements(data);
      }
    };
    fetch();
  }, []);

  return (
    <Screen headerShown title={i18n.t("page_title_announce")}>
      {announcement.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator animating color={Colors.theme} />
        </View>
      ) : (
        <FlatList
          pagingEnabled
          snapToInterval={width}
          style={styles.main}
          data={announcement}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={({ item, index }) => {
            return (
              <AnnounceCard
                index={index + 1}
                total={announcement.length}
                announce={item}
              />
            );
          }}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: Colors.pageDefaultBackground,
    flex: 1,
  },
});

export default Announcement;
