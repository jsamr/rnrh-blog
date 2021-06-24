import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RenderHTMLSource, Document } from "react-native-render-html";
import { ActivityIndicator } from "react-native-paper";
import { useScroller } from "../utils/scroller";
import { useState } from "react";
import { useEffect } from "react";

function LoadingDisplay() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color="#61dafb" size="large" />
    </View>
  );
}

const HZ_MARGIN = 10;

// A trick to avoid the UI hanging when navigating.
function useDelayedLoading(dom: Document | null) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(
    useCallback(
      function onFocus() {
        const timeout = setTimeout(() => setIsLoading(dom == null), 100);
        return () => clearTimeout(timeout);
      },
      [dom]
    )
  );
  return { isLoading };
}

export default function ArticleBody({
  dom,
  scrollViewRef,
}: {
  dom: Document | null;
  scrollViewRef: any;
}) {
  const { width } = useWindowDimensions();
  const { isLoading } = useDelayedLoading(dom);
  const availableWidth = Math.min(width, 500);
  const scroller = useScroller();
  return (
    <ScrollView
      {...scroller.handlers}
      style={styles.container}
      ref={scrollViewRef}
      scrollEventThrottle={100}
      contentContainerStyle={[styles.content, { width: availableWidth }]}
    >
      {isLoading ? (
        <LoadingDisplay />
      ) : (
        <RenderHTMLSource
          contentWidth={availableWidth - 2 * HZ_MARGIN}
          source={{
            dom: dom!,
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    alignSelf: "center",
    paddingHorizontal: HZ_MARGIN,
    // leave some space for the FAB
    paddingBottom: 65,
  },
  loading: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
