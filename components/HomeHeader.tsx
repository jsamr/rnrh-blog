import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SvgReactNative from "../components/ReactNativeLogo";
import useThemeColor from "../hooks/useThemeColor";

export default function HomeHeader() {
  const { top } = useSafeAreaInsets();
  const surface = useThemeColor("surface");
  const onSurface = useThemeColor("onSurface");
  const textStyle = { color: onSurface };
  return (
    <>
      <View
        style={[
          headerStyles.container,
          {
            paddingTop: Platform.select({ ios: 0, default: top }) + 40,
            backgroundColor: surface,
            marginBottom: 10,
          },
        ]}
      >
        <View style={headerStyles.main}>
          <View style={headerStyles.textContainer}>
            <Text style={headerStyles.title}>React Native Blog</Text>
            <Text style={[headerStyles.subtitle, textStyle]}>
              Learn once, write anywhere.
            </Text>
          </View>
          <SvgReactNative />
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
    color: "white",
  },
  powered: {
    marginTop: 10,
    fontSize: 9,
    color: "gray",
  },
});
