import React, { PropsWithChildren } from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../utils/Colors";

function openLink(url: string) {
  return () => Linking.openURL(url);
}

function Link({ children, url }: PropsWithChildren<{ url: string }>) {
  return (
    <Text style={styles.link} onPress={openLink(url)}>
      {children}
    </Text>
  );
}

export default function HomeHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingTop: Platform.select({ ios: 0, default: top }) + 40,
            marginBottom: 10,
          },
        ]}
      >
        <View style={styles.main}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>React Native Blog</Text>
            <Text style={styles.subtitle}>Learn once, write anywhere.</Text>
          </View>
        </View>
        <Text style={styles.powered}>
          powered by{" "}
          <Link url="https://meliorence.github.io/react-native-render-html">
            React Native Render HTML
          </Link>
          . {"\n"}
          <Link url="https://github.com/jsamr/rnrh-blog/tree/enhanced">
            Source code on Github
          </Link>
          .
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
  },
  container: {
    paddingVertical: 40,
    padding: 20,
    backgroundColor: Colors.darkerGray,
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {},
  title: {
    fontSize: 32,
    color: "#61dafb",
  },
  subtitle: {
    fontSize: 21,
    color: Colors.textLight,
  },
  powered: {
    marginTop: 10,
    fontSize: 9,
    color: "gray",
  },
});
