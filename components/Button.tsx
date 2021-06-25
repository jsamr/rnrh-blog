import React from "react";
import { Pressable, StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import useThemeColor from "../hooks/useThemeColor";

export default function Button({
  label,
  active,
  onPress,
  textStyle,
}: {
  label: string;
  active: boolean;
    onPress: () => void;
  textStyle?: StyleProp<TextStyle>
}) {
  const text = useThemeColor("text");
  const activeBackground = useThemeColor("softHighlight");
  return (
    <Pressable
      style={[
        styles.container,
        active && { backgroundColor: activeBackground },
      ]}
      onPress={onPress}
      android_ripple={{ color: "#baebf3" }}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.label,
          { color: text },
          textStyle
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingRight: 20,
    paddingLeft: 10,
    marginLeft: 10,
    borderRadius: 10,
    paddingVertical: 10,
  },
  label: {
    textAlign: "right",
    fontSize: 14,
  },
  "label--h2": {
    fontSize: 18,
  },
  "label--h3": {},
});
