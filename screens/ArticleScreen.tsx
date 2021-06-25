import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../shared-types";
import ArticleBody from "../components/ArticleBody";
import useArticleDom from "../hooks/useArticleDom";
import { StyleSheet, FlatList } from "react-native";
import { DrawerLayout } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import TOC from "../components/TOC";
import Scroller from "../utils/Scroller";
import { ScrollerProvider } from "../utils/scroller";
import { StatusBar } from "expo-status-bar";
import useColorScheme from "../hooks/useColorScheme";
import useThemeColor from "../hooks/useThemeColor";
import CollapsibleArticleHeader from "../components/CollapsibleArticleHeader";
import { ScrollStateProvider, useScrollState } from "../utils/scroll-anim";

type ArticleScreenProps = StackScreenProps<RootStackParamList, "Article">;

function useSetTitleEffect({ route, navigation }: ArticleScreenProps) {
  useEffect(
    function setTitle() {
      navigation.setOptions({ title: route.params!.title });
    },
    [route.params.title, navigation]
  );
}

function useDrawer() {
  const drawerRef = useRef<DrawerLayout>(null);
  const openDrawer = useCallback(() => {
    drawerRef.current?.openDrawer();
  }, []);
  const closeDrawer = useCallback(() => {
    drawerRef.current?.closeDrawer();
  }, []);
  return {
    drawerRef,
    openDrawer,
    closeDrawer,
  };
}

function useScrollFeature(scrollerDep: any) {
  const scrollViewRef = useRef<null | FlatList<any>>(null);
  const { headerHeight: topOffset } = useScrollState();
  const scroller = useMemo(
    () => new Scroller(scrollViewRef, topOffset),
    [scrollerDep, topOffset]
  );
  return {
    scroller,
    scrollViewRef,
  };
}

function ThemedFAB({ onPress }: { onPress: any }) {
  const pressableBackground = useThemeColor("pressableBackground");
  const pressableTint = useThemeColor("pressableTint");
  return (
    <FAB
      style={[styles.fab, { backgroundColor: pressableBackground }]}
      color={pressableTint}
      icon="format-list-bulleted-square"
      onPress={onPress}
    />
  );
}

function ArticleContent(props: ArticleScreenProps) {
  useSetTitleEffect(props);
  const url = props.route.params.url;
  const colorScheme = useColorScheme();
  const { dom, headings } = useArticleDom(url);
  const { drawerRef, openDrawer, closeDrawer } = useDrawer();
  const { scroller } = useScrollFeature(url);
  const onPressEntry = useCallback(
    (entry: string) => {
      closeDrawer();
      if (entry) {
        scroller.scrollToEntry(entry);
      } else {
        scroller.scrollToTop();
      }
    },
    [scroller]
  );
  const renderToc = useCallback(
    function renderToc() {
      return (
        <TOC
          title={props.route.params.title}
          headings={headings}
          onPressEntry={onPressEntry}
        />
      );
    },
    [headings]
  );
  return (
    <ScrollerProvider scroller={scroller}>
      <DrawerLayout
        drawerPosition="right"
        drawerWidth={300}
        renderNavigationView={renderToc}
        ref={drawerRef}
      >
        <ArticleBody dom={dom} />
        <ThemedFAB onPress={openDrawer} />
        <CollapsibleArticleHeader />
      </DrawerLayout>
      <StatusBar animated style={colorScheme === "dark" ? "light" : "dark"} />
    </ScrollerProvider>
  );
}

export default function ArticleScreen(props: ArticleScreenProps) {
  return (
    <ScrollStateProvider>
      <ArticleContent {...props} />
    </ScrollStateProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
