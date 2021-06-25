import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { textContent } from "domutils";
import { Element } from "domhandler";
import TOCEntry from "./TOCEntry";
import useOnEntryChangeEffect from "../hooks/useOnEntryChangeEffect";
import useThemeColor from "../hooks/useThemeColor";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "./Button";

export default function TOC({
  headings,
  onPressEntry,
  title,
}: {
  headings: Element[];
  title: string;
  onPressEntry?: (name: string) => void;
}) {
  const surface = useThemeColor("card");
  const { top: topOffset } = useSafeAreaInsets();
  const [activeEntry, setActiveEntry] = useState("");
  useOnEntryChangeEffect(setActiveEntry);
  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: topOffset + 10 },
      ]}
      style={[styles.scrollView, { backgroundColor: surface }]}
    >
      <View style={styles.scrollBackground} />
      <Button
        label={title}
        active={activeEntry === ""}
        textStyle={styles.titleLabel}
        onPress={() => onPressEntry?.("")}
      />
      {headings.map((header) => {
        const headerName = textContent(header);
        const onPress = () => {
          setActiveEntry(headerName);
          onPressEntry?.(headerName);
        };
        return (
          <TOCEntry
            active={headerName === activeEntry}
            key={headerName}
            onPress={onPress}
            tagName={header.tagName}
            label={headerName}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "white",
    opacity: 0.92,
    paddingRight: 10,
  },
  scrollContent: {
    flex: 1,
    paddingVertical: 20,
    position: "relative",
  },
  scrollBackground: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    borderRightWidth: 1,
    marginRight: 10,
    borderColor: "rgba(125,125,125,0.3)",
  },
  titleLabel: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
