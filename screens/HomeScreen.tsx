import React, { useMemo } from "react";
import {
  Platform,
  RefreshControl,
  RefreshControlProps,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import groupBy from "ramda/src/groupBy";
import map from "ramda/src/map";
import pipe from "ramda/src/pipe";
import sort from "ramda/src/sort";
import descend from "ramda/src/descend";
import prop from "ramda/src/prop";
import { FeedItem } from "../shared-types";
import FeedItemDisplay from "../components/FeedItemDisplay";
import useRssFeed from "../hooks/useRssFeed";
import HomeHeader from "../components/HomeHeader";
import FeedYearDisplay from "../components/FeedYearDisplay";

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

const renderItem: SectionListRenderItem<FeedItem> = function renderItem({
  item,
}) {
  return <FeedItemDisplay item={item} />;
};

const groupSections = pipe<
  FeedItem[],
  Record<string, FeedItem[]>,
  Array<[string, FeedItem[]]>,
  Array<{ title: string; data: FeedItem[] }>,
  Array<{ title: string; data: FeedItem[] }>
>(
  groupBy((item: FeedItem) => new Date(item.published).getFullYear() + ""),
  Object.entries,
  map(([title, data]) => ({ title, data })),
  sort(descend(prop("title")))
);

const renderSectionHeader = ({
  section,
}: {
  section: SectionListData<FeedItem>;
}) => {
  return <FeedYearDisplay title={section.title} />;
};

export default function HomeScreen() {
  const { bottom, top } = useSafeAreaInsets();
  const { items, refresh, isLoading } = useRssFeed(
    "https://reactnative.dev/blog/rss.xml"
  );
  const itemsByYear = useMemo(
    () => (items ? groupSections(items) : []),
    [items]
  );
  return (
    <>
      <SectionList
        refreshControl={
          Platform.OS === "android" ? (
            <Refresh onRefresh={refresh} refreshing={isLoading} />
          ) : undefined
        }
        onRefresh={refresh}
        refreshing={isLoading}
        contentInset={Platform.select({ ios: { top }, default: undefined })}
        contentContainerStyle={{ paddingBottom: bottom }}
        sections={itemsByYear}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListFooterComponent={Separator}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={HomeHeader}
        stickySectionHeadersEnabled={false}
      />
      <HeaderOverlay />
      <StatusBar animated style="light" />
    </>
  );
}
