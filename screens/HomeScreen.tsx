import React from "react";
import {
  FlatList,
  ListRenderItem,
  Platform,
  RefreshControl,
  RefreshControlProps,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { FeedItem } from "../shared-types";
import FeedItemDisplay from "../components/FeedItemDisplay";
import useRssFeed from "../hooks/useRssFeed";
import HomeHeader from "../components/HomeHeader";

function HeaderOverlay() {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        width: "100%",
        height: top,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(15,15,15,0.75)",
      }}
    ></View>
  );
}

function Refresh(props: RefreshControlProps) {
  const { top } = useSafeAreaInsets();
  return <RefreshControl {...props} progressViewOffset={top} />;
}

function Separator() {
  return <View style={{ height: 10 }} />;
}

const renderItem: ListRenderItem<FeedItem> = function renderItem({ item }) {
  return <FeedItemDisplay item={item} />;
};

export default function HomeScreen() {
  const { bottom, top } = useSafeAreaInsets();
  const { items, refresh, isLoading } = useRssFeed(
    "https://reactnative.dev/blog/rss.xml"
  );
  return (
    <>
      <FlatList
        refreshControl={
          Platform.OS === "android" ? (
            <Refresh onRefresh={refresh} refreshing={isLoading} />
          ) : undefined
        }
        onRefresh={refresh}
        refreshing={isLoading}
        contentInset={Platform.select({ ios: { top }, default: undefined })}
        contentContainerStyle={{ paddingBottom: bottom }}
        data={items}
        renderItem={renderItem}
        ListFooterComponent={Separator}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={HomeHeader}
      />
      <HeaderOverlay />
      <StatusBar animated style="light" />
    </>
  );
}
