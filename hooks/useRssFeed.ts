import * as rssParser from "react-native-rss-parser";
import { useQuery } from "react-query";
import { FeedItem } from "../shared-types";

export default function useRssFeed(feed: string) {
  const {
    isLoading,
    data: items,
    refetch: refresh,
  } = useQuery("rss", async () => {
    const response = await fetch(feed);
    if (response.ok) {
      const data = await response.text();
      const feed = await rssParser.parse(data);
      return feed.items as unknown as FeedItem[];
    }
  });
  return {
    refresh,
    isLoading,
    items,
  };
}
