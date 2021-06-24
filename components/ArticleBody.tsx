import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RenderHTMLSource, Document } from "react-native-render-html";
import { ActivityIndicator } from "react-native-paper";
import { useScroller } from "../utils/scroller";
import { useState } from "react";
import { useEffect } from "react";
import { InteractionManager } from "react-native";

function LoadingDisplay() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color="#61dafb" size="large" />
    </View>
  );
}

const HZ_MARGIN = 10;

export default function ArticleBody({
  dom,
}: {
  dom: Document | null;
}) {
  const { width } = useWindowDimensions();
  const availableWidth = Math.min(width, 500);
  return !dom ? (
    <LoadingDisplay />
  ) : (
    <RenderHTMLSource
      contentWidth={availableWidth - 2 * HZ_MARGIN}
      source={{
        dom,
      }}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
