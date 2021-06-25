import React from "react";
import { Headline } from "react-native-paper";
import useThemeColor from "../hooks/useThemeColor";

export default function FeedYearDisplay({ title }: { title: string }) {
  const textColor = useThemeColor("tint");
  return (
    <Headline
      style={{
        color: textColor,
        paddingHorizontal: 10,
        lineHeight: 30,
        paddingTop: 9,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 30,
        fontSize: 30,
        borderBottomColor: textColor,
        borderBottomWidth: 2,
        borderRadius: 4,
        alignSelf: "center",
      }}
    >
      {title}
    </Headline>
  );
}
