import React from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FeedItem } from "../shared-types";
import FeedItemDisplay from "../components/FeedItemDisplay";
import useRssFeed from "../hooks/useRssFeed";

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
