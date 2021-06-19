const textDark = "#1c1e21";
const textLight = "#dedfe0";
const backgroundLight = "#f7fafc";
const backgroundDark = "#18191a";
const darkerGray = "#20232a";
const darkGray = "#282c34";
const softHighlightDark = "rgba(186, 235, 243, 0.5)";
const softHighlightLight = "rgba(186, 235, 243, 0.5)";

const invariants = {
  accent: "#e1f1f5",
  tint: "#61dafb",
};

const Colors = {
  textDark,
  textLight,
  darkerGray,
  invariants,
  light: {
    headerBackground: "white",
    headerColor: textDark,
    text: textDark,
    background: backgroundLight,
    softHighlight: softHighlightLight,
    pressableBackground: "white",
    pressableTint: invariants.tint,
    anchorBackground: "rgba(187, 239, 253, 0.3)",
    card: "white",
    surface: "#f2feff",
    onSurface: "#fff",
    ...invariants,
  },
  dark: {
    headerBackground: darkerGray,
    headerColor: textLight,
    text: textLight,
    background: backgroundDark,
    softHighlight: softHighlightDark,
    pressableBackground: darkGray,
    pressableTint: invariants.tint,
    anchorBackground: "rgba(97, 218, 251, 0.12)",
    card: "#282c34",
    surface: "#282c34",
    onSurface: "#fff",
    ...invariants,
  },
};

export type ColorTheme = typeof Colors["dark"];

export default Colors;
