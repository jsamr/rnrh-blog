import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import useThemeColor from "../hooks/useThemeColor";

export default function TOCEntry({
  headerName,
  tagName,
  active,
  onPress,
}: {
  headerName: string;
  tagName: string;
  active: boolean;
  onPress: () => void;
}) {
  const text = useThemeColor("text");
  return (
    <Pressable
      style={[styles.container, active && styles["container--active"]]}
      onPress={onPress}
      android_ripple={{ color: "#baebf3" }}
    >
      <Text
        style={[
          styles.label,
          styles[`label--${tagName as "h2" | "h3"}` as const],
          { color: text },
        ]}
      >
        {headerName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingRight: 20,
    marginLeft: 10,
    borderRadius: 10,
    paddingVertical: 10,
  },
  "container--active": {
    backgroundColor: "rgba(186, 235, 243, 0.5)",
  },
  label: {
    textAlign: "right",
    fontSize: 14,
    color: "rgb(28, 30, 33)",
  },
  "label--h2": {
    fontSize: 18,
  },
  "label--h3": {},
});
