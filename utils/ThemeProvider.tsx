import React from "react";
import {
  DefaultTheme as NavigationLight,
  DarkTheme as NavigationDark,
  Theme as NavigationTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { PropsWithChildren } from "react";
import {
  DarkTheme as PaperDark,
  DefaultTheme as PaperLight,
  ThemeProvider as PaperThemeProvider,
} from "react-native-paper";
import useColorScheme from "../hooks/useColorScheme";
import Colors, { ColorTheme } from "./Colors";

type PaperTheme = typeof PaperDark;

type ColorsMixin = PaperTheme["colors"] &
  NavigationTheme["colors"] &
  ColorTheme;

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

function makeNavigationTheme(
  colors: ColorsMixin,
  dark: boolean
): NavigationTheme {
  return {
    dark,
    colors: {
      ...colors,
      card: colors.headerBackground,
      text: colors.headerColor,
      primary: colors.tint
    },
  };
}

function makePaperTheme(colors: ColorsMixin): PaperTheme {
  return {
    ...PaperDark,
    colors: {
      ...colors,
      surface: colors.card,
    },
  };
}

const navigationDark = makeNavigationTheme(colorsDark, true);
const navigationLight = makeNavigationTheme(colorsLight, false);
const paperDark = makePaperTheme(colorsDark);
const paperLight = makePaperTheme(colorsLight);

export default function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const colorScheme = useColorScheme();
  const navigationTheme =
    colorScheme === "dark" ? navigationDark : navigationLight;
  const paperTheme = colorScheme === "dark" ? paperDark : paperLight;
  return (
    <PaperThemeProvider theme={paperTheme}>
      <NavigationContainer theme={navigationTheme}>
        {children}
      </NavigationContainer>
    </PaperThemeProvider>
  );
}
