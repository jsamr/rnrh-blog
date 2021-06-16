import { useState, useEffect, useCallback } from "react";
import * as rssParser from "react-native-rss-parser";
import { FeedItem } from "../shared-types";

export default function useRssFeed(feed: string) {
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
