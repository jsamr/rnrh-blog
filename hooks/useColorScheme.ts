import { useEffect, useState } from "react";
import {
  Appearance,
  ColorSchemeName,
  useColorScheme as _useColorScheme,
} from "react-native";

// Circumvent this bug happening with splashscreen: https://github.com/facebook/react-native/issues/28525
export default function useColorScheme(): NonNullable<ColorSchemeName> {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  useEffect(() => {
    const listener: Appearance.AppearanceListener = () => {
      setColorScheme(Appearance.getColorScheme());
    };
    Appearance.addChangeListener(listener);
    return () => Appearance.removeChangeListener(listener);
  }, []);
  return colorScheme as NonNullable<ColorSchemeName>;
}
