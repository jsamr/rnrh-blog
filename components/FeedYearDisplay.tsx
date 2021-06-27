import React from "react";
import { Headline } from "react-native-paper";

export default function FeedYearDisplay({ title }: { title: string }) {
  const color = 'rgb(118, 118, 118)';
  return (
    <Headline
      style={{
        color,
        paddingHorizontal: 10,
        lineHeight: 30,
        paddingTop: 9,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 30,
        fontSize: 30,
        alignSelf: "center",
      }}
    >
      {title}
    </Headline>
  );
}
