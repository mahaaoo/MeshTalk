import { Icon, Screen } from "@components";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";

import { Colors } from "../../config";
import useI18nStore from "../../store/useI18nStore";
import { trendsStatuses, trendsTags, suggestions } from "../../server/timeline";
import HashTagItem from "@ui/hashtag/HashTagItem";
import { HashTag, Suggestion, Timelines } from "../../config/interface";
import StatusItem from "@ui/statusItem";
import UserItem from "@ui/fans/userItem";

interface PublicProps {
  tabLabel: string;
}

const Public: React.FC<PublicProps> = () => {
  const { i18n } = useI18nStore();
  const [trendTags, setTrendTags] = useState<HashTag[]>([]);
  const [trendStatuse, setTrendStatuse] = useState<Timelines[]>([]);
  const [suggestion, setSuggestion] = useState<Suggestion[]>([]);
  const [refresh, setRefresh] = useState(false);

  const fetchTrendsTag = async () => {
    const { data, ok } = await trendsTags(5);
    if (data && ok) {
      setTrendTags(data);
    }
  };
  const fetchTrendsStatuses = async () => {
    const { data, ok } = await trendsStatuses(3);
    if (data && ok) {
      setTrendStatuse(data);
    }
  };

  const fetchSuggestion = async () => {
    const { data, ok } = await suggestions(5);
    if (data && ok) {
      setSuggestion(data);
    }
  };

  useEffect(() => {
    fetchTrendsTag();
    fetchTrendsStatuses();
    fetchSuggestion();
  }, []);

  const onRefresh = async () => {
    setRefresh(true);
    Promise.all([
      fetchTrendsTag(),
      fetchTrendsStatuses(),
      fetchSuggestion(),
    ]).finally(() => {
      setRefresh(false);
    });
  };

  return (
    <Screen headerShown title={i18n.t("tabbar_icon_explore")}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        style={[styles.main]}
      >
        <View>
          <View>
            <View style={styles.popularView}>
              <Text style={styles.popularTitle}>当下流行的标签</Text>
            </View>
            {trendTags.length > 0 &&
              trendTags.map((item, index) => (
                <HashTagItem item={item} key={item.url} />
              ))}
            <TouchableOpacity style={styles.moreView}>
              <Text style={styles.moreText}>查看更多</Text>
              <Icon name="arrowRight" color="#777" />
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.popularView}>
              <Text style={styles.popularTitle}>当下流行的嘟文</Text>
            </View>

            {trendStatuse.length > 0 &&
              trendStatuse.map((item, index) => (
                <StatusItem item={item} key={item.id} needDivide={false} />
              ))}
            <TouchableOpacity style={[styles.moreView]}>
              <Text style={styles.moreText}>查看更多</Text>
              <Icon name="arrowRight" color="#777" />
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.popularView}>
              <Text style={styles.popularTitle}>推荐的用户</Text>
            </View>

            {suggestion.length > 0 &&
              suggestion.map((item, index) => (
                <UserItem key={item.account.id} item={item.account} />
              ))}
            <TouchableOpacity style={[styles.moreView]}>
              <Text style={styles.moreText}>查看更多</Text>
              <Icon name="arrowRight" color="#777" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.pageDefaultBackground,
  },
  popularView: {
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  popularTitle: {
    fontSize: 16,
    color: "#777",
    fontWeight: "bold",
  },
  moreView: {
    backgroundColor: "#fff",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  moreText: {
    fontSize: 16,
    color: Colors.theme,
  },
});

export default Public;
