import React from "react";
import { StyleSheet } from "react-native";
import Button from "./Button";

export default function TOCEntry({
  tagName,
  ...props
}: {
  label: string;
  tagName: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      {...props}
      textStyle={styles[`label--${tagName as "h2" | "h3"}` as const]}
    />
  );
}

const styles = StyleSheet.create({
  "label--h2": {
    fontSize: 18,
  },
  "label--h3": {},
});
