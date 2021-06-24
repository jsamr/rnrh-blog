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
  const scroller = useMemo(() => new Scroller(scrollViewRef), [scrollerDep]);
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

export default function ArticleScreen(props: ArticleScreenProps) {
  useSetTitleEffect(props);
  const url = props.route.params.url;
  const colorScheme = useColorScheme();
  const { dom, headings } = useArticleDom(url);
  const { drawerRef, openDrawer, closeDrawer } = useDrawer();
  const { scrollViewRef, scroller } = useScrollFeature(url);
  const onPressEntry = useCallback(
    (entry: string) => {
      closeDrawer();
      scroller.scrollToEntry(entry);
    },
    [scroller]
  );
  const renderToc = useCallback(
    function renderToc() {
      return <TOC headings={headings} onPressEntry={onPressEntry} />;
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
      </DrawerLayout>
      <StatusBar animated style={colorScheme === "dark" ? "light" : "dark"} />
    </ScrollerProvider>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
