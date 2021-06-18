import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../utils/Colors";

export default function HomeHeader() {
  const { top } = useSafeAreaInsets();
  return (
    <>
      <View
        style={[
          headerStyles.container,
          {
            paddingTop: Platform.select({ ios: 0, default: top }) + 40,
            marginBottom: 10,
          },
        ]}
      >
        <View style={headerStyles.main}>
          <View style={headerStyles.textContainer}>
            <Text style={headerStyles.title}>React Native Blog</Text>
            <Text style={headerStyles.subtitle}>
              Learn once, write anywhere.
            </Text>
          </View>
        </View>
        <Text style={headerStyles.powered}>
          powered by React Native Render HTML
        </Text>
      </View>
    </>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    padding: 20,
    backgroundColor: Colors.darkerGray
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
