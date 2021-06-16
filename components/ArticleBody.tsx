import React from "react";
import { StyleSheet, View } from "react-native";
import { useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RenderHTMLSource, Document } from "react-native-render-html";
import { ActivityIndicator } from "react-native-paper";

function LoadingDisplay() {
  return (
    <View
      style={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function ArticleBody({ dom }: { dom: Document | null }) {
  const { width } = useWindowDimensions();
  const realWidth = Math.min(width, 500);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.container,
        { alignSelf: "center", maxWidth: realWidth },
      ]}
    >
      {dom ? (
        <RenderHTMLSource
          contentWidth={realWidth}
          source={{
            dom,
          }}
        />
      ) : (
        <LoadingDisplay />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});
