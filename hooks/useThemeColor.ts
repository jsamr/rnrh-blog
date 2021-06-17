import Colors from "../utils/Colors";
import useColorScheme from "./useColorScheme";

export default function useThemeColor(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  return Colors[theme][colorName];

}