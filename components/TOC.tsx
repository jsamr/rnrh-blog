import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { textContent } from "domutils";
import { Element } from "domhandler";
import TOCEntry from "./TOCEntry";
import useOnEntryChangeEffect from "../hooks/useOnEntryChangeEffect";

export default function TOC({
  headings,
  onPressEntry,
}: {
  headings: Element[];
  onPressEntry?: (name: string) => void;
}) {
  const [activeEntry, setActiveEntry] = useState(
    headings.length ? textContent(headings[0]) : ""
  );
  useOnEntryChangeEffect(setActiveEntry);
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.scrollView}
    >
      <View style={styles.scrollBackground} />
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
            headerName={headerName}
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
});
