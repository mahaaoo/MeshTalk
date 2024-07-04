import { Icon, Screen } from "@components";
import React, { useCallback, useEffect, useState } from "react";
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
import {
  trendsStatuses,
  trendsTags,
  suggestions,
  trendsLinks,
} from "../../server/timeline";
import HashTagItem from "@ui/hashtag/HashTagItem";
import { Card, HashTag, Suggestion, Timelines } from "../../config/interface";
import StatusItem from "@ui/statusItem";
import UserItem from "@ui/fans/userItem";
import WebCard from "@ui/statusItem/webCard";
import { useSubscribeToken } from "@utils/hooks";

interface PublicProps {
  tabLabel: string;
}

const Public: React.FC<PublicProps> = () => {
  const { i18n } = useI18nStore();
  const [trendTags, setTrendTags] = useState<HashTag[]>([]);
  const [trendStatuse, setTrendStatuse] = useState<Timelines[]>([]);
  const [suggestion, setSuggestion] = useState<Suggestion[]>([]);
  const [link, setLink] = useState<Card[]>([]);

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

  const fetchLink = async () => {
    const { data, ok } = await trendsLinks(5);
    if (data && ok) {
      setLink(data);
    }
  };

  useEffect(() => {
    fetchTrendsTag();
    fetchTrendsStatuses();
    fetchSuggestion();
    fetchLink();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    Promise.all([
      fetchTrendsTag(),
      fetchTrendsStatuses(),
      fetchSuggestion(),
      fetchLink(),
    ]).finally(() => {
      setRefresh(false);
    });
  }, []);

  useSubscribeToken(onRefresh);

  return (
    <Screen headerShown title={i18n.t("tabbar_icon_explore")}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
        style={[styles.main]}
      >
        <View>
          {trendTags.length > 0 ? (
            <>
              <View style={styles.popularView}>
                <Text style={styles.popularTitle}>当下流行的标签</Text>
              </View>
              {trendTags.map((item, index) => (
                <HashTagItem item={item} key={item.url} />
              ))}
              <TouchableOpacity style={styles.moreView}>
                <Text style={styles.moreText}>查看更多</Text>
                <Icon name="arrowRight" color="#777" />
              </TouchableOpacity>
            </>
          ) : null}
          {trendStatuse.length > 0 ? (
            <>
              <View style={styles.popularView}>
                <Text style={styles.popularTitle}>当下流行的嘟文</Text>
              </View>

              {trendStatuse.map((item, index) => (
                <StatusItem item={item} key={item.id} needDivide={false} />
              ))}
              <TouchableOpacity style={[styles.moreView]}>
                <Text style={styles.moreText}>查看更多</Text>
                <Icon name="arrowRight" color="#777" />
              </TouchableOpacity>
            </>
          ) : null}
          {suggestion.length > 0 ? (
            <>
              <View style={styles.popularView}>
                <Text style={styles.popularTitle}>推荐的用户</Text>
              </View>

              {suggestion.map((item, index) => (
                <UserItem key={item.account.id} item={item.account} />
              ))}
              <TouchableOpacity style={[styles.moreView]}>
                <Text style={styles.moreText}>查看更多</Text>
                <Icon name="arrowRight" color="#777" />
              </TouchableOpacity>
            </>
          ) : null}
          {link.length > 0 ? (
            <>
              <View style={styles.popularView}>
                <Text style={styles.popularTitle}>当下流行的网页</Text>
              </View>

              <View style={{ backgroundColor: "#fff", padding: 15 }}>
              {link.map((item, index) => (
                <WebCard card={item} key={item.url} />
              ))}
              </View>
              <TouchableOpacity style={[styles.moreView]}>
                <Text style={styles.moreText}>查看更多</Text>
                <Icon name="arrowRight" color="#777" />
              </TouchableOpacity>
            </>
          ) : null}
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
