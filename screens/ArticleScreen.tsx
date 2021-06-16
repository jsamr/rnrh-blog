import React, { useCallback, useEffect, useRef } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../shared-types";
import ArticleBody from "../components/ArticleBody";
import useArticleDom from "../hooks/useArticleDom";
import { StyleSheet } from "react-native";
import { DrawerLayout } from "react-native-gesture-handler";
import { FAB } from "react-native-paper";
import TOC from "../components/TOC";

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

export default function ArticleScreen(props: ArticleScreenProps) {
  useSetTitleEffect(props);
  const { dom, headings } = useArticleDom(props.route.params.url);
  const { drawerRef, openDrawer } = useDrawer();
  const onPressEntry = useCallback((entry: string) => {
    // We'll handle that later
  }, [])
  const renderToc = useCallback(function renderToc() {
    return <TOC headings={headings} onPressEntry={onPressEntry} />;
  }, [headings]);
  return (
    <DrawerLayout
      drawerPosition="right"
      drawerWidth={300}
      renderNavigationView={renderToc}
      ref={drawerRef}
    >
      <ArticleBody dom={dom} />
      <FAB
        style={styles.fab}
        icon="format-list-bulleted-square"
        onPress={openDrawer}
      />
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
