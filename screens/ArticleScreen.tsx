import React, { useCallback, useEffect, useRef, useMemo } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../shared-types";
import ArticleBody from "../components/ArticleBody";
import useArticleDom from "../hooks/useArticleDom";
import { StyleSheet } from "react-native";
import { DrawerLayout, ScrollView } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import TOC from "../components/TOC";
import Scroller from "../utils/Scroller";
import { ScrollerProvider } from "../utils/scrollerContext";

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
  const scrollViewRef = useRef<null | ScrollView>(null);
  const scroller = useMemo(() => new Scroller(scrollViewRef), [scrollerDep]);
  return {
    scroller,
    scrollViewRef,
  };
}

export default function ArticleScreen(props: ArticleScreenProps) {
  useSetTitleEffect(props);
  const url = props.route.params.url;
  const { dom, headings } = useArticleDom(url);
  const { drawerRef, openDrawer, closeDrawer } = useDrawer();
  const { scrollViewRef, scroller } = useScrollFeature(url);
  const onPressEntry = useCallback((entry: string) => {
    closeDrawer();
    scroller.scrollToEntry(entry);
  }, [scroller]);
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
        <ArticleBody scrollViewRef={scrollViewRef} dom={dom} />
        <FAB
          style={styles.fab}
          icon="format-list-bulleted-square"
          onPress={openDrawer}
        />
      </DrawerLayout>
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
