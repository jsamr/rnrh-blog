import React, { PropsWithChildren } from "react";
import { View } from "react-native";
import useThemeColor from "../hooks/useThemeColor";

export default function Background({ children }: PropsWithChildren<{}>) {
  const background = useThemeColor("background");
  return (
    <View style={{ backgroundColor: background, flex: 1 }}>{children}</View>
  );
}
