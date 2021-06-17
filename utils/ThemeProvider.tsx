import React from 'react';
import {
  DefaultTheme as NavigationLight,
  DarkTheme as NavigationDark,
  Theme as NavigationTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { PropsWithChildren } from "react";
import {
  DarkTheme as PaperDark,
  DefaultTheme as PaperLight,
  ThemeProvider as PaperThemeProvider,
} from "react-native-paper";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "./Colors";

type PaperTheme = typeof PaperDark;

type ColorsMixin = PaperTheme["colors"] & NavigationTheme["colors"];

const colorsDark: ColorsMixin = {
  ...PaperDark.colors,
  ...NavigationDark.colors,
  ...Colors.dark,
  primary: Colors.dark.surface,
};

const colorsLight: ColorsMixin = {
  ...PaperLight.colors,
  ...NavigationLight.colors,
  ...Colors.light,
  primary: Colors.dark.surface,
};

const paperDark: PaperTheme = {
  ...PaperDark,
  colors: colorsDark,
};

const paperLight: PaperTheme = {
  ...PaperLight,
  colors: colorsLight,
};

const navigationDark: NavigationTheme = {
  dark: true,
  colors: colorsDark,
};

const navigationLight: NavigationTheme = {
  dark: false,
  colors: colorsLight,
};

export default function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const colorScheme = useColorScheme();
  const navigationTheme = colorScheme === "dark" ? navigationDark : navigationLight;
  const paperTheme = colorScheme === "dark" ? paperDark : paperLight;
  return (
    <PaperThemeProvider theme={paperTheme}>
      <NavigationThemeProvider value={navigationTheme}>
        {children}
      </NavigationThemeProvider>
    </PaperThemeProvider>
  );
}
