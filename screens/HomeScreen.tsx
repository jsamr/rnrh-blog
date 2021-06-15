import React, { useState, useEffect, useCallback } from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as rssParser from "react-native-rss-parser";
import { FeedItem } from "../shared-types";
import FeedItemDisplay from "../components/FeedItemDisplay";

function useRssFeed(feed: string) {
  const [{ isRefreshing, refreshId, items }, setRssState] = useState({
    items: null as null | FeedItem[],
    isRefreshing: true,
    refreshId: 0,
  });
  const refresh = useCallback(() => {
    setRssState((s) => ({
      ...s,
      isRefreshing: true,
      refreshId: s.refreshId + 1,
    }));
  }, []);
  useEffect(
    function loadFeed() {
      let cancelled = false;
      (async function () {
        const response = await fetch(feed);
        if (response.ok) {
          const data = await response.text();
          const feed = await rssParser.parse(data);
          !cancelled &&
            setRssState((s) => ({
              ...s,
              items: feed.items as unknown as FeedItem[],
              isRefreshing: false,
            }));
        } else {
          !cancelled &&
            setRssState((s) => ({
              ...s,
              isRefreshing: false,
            }));
        }
      })();
      return () => {
        cancelled = true;
      };
    },
    [refreshId, feed]
  );
  return { refresh, isRefreshing, items };
}

function Separator() {
  return <View style={{ height: 10 }} />;
}

const renderItem: ListRenderItem<FeedItem> = function renderItem({ item }) {
  return <FeedItemDisplay item={item} />;
};

export default function HomeScreen() {
  const { items, refresh, isRefreshing } = useRssFeed(
    "https://reactnative.dev/blog/rss.xml"
  );
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <FlatList
        onRefresh={refresh}
        refreshing={isRefreshing}
        data={items}
        renderItem={renderItem}
        ListFooterComponent={Separator}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={Separator}
      />
    </SafeAreaView>
  );
}
