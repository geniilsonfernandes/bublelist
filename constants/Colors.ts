/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#0a7ea4";

export const backgroundDark = {
  100: "#151718",
};
const primary = {
  "primary.100": "#3954FB",
  "primary.200": "#4782FE",
  "primary.300": "#55ADFF",
  "primary.400": "#63D3FF",
  "primary.500": "#72F4FF",
  "primary.600": "#82FFFD",
  "primary.700": "#92FFE9",
};

const avocado = {
  "primary.100": "#FFA7A8",
  "primary.200": "#FFAEB4",
  "primary.300": "#FFB4BF",
  "primary.400": "#FFBBCA",
  "primary.500": "#FFC3D4",
  "primary.600": "#FFCADD",
  "primary.700": "#FFD1E5",
};

const gray = {
  "gray.100": "#F2F2F2",
  "gray.200": "#E6E6E6",
  "gray.300": "#DBDBDB",
  "gray.400": "#D0D0D0",
  "gray.500": "#C4C4C4",
  "gray.600": "#B2B2B2",
  "gray.700": "#868686",
  "gray.800": "#5A595A",
  "gray.900": "#2D2E2F",
};

export const Colors = {
  light: {
    text: "#444444",
    "text.1": "#444444",
    "text.2": "#555555",
    "text.3": "#666666",
    "text.4": "#777777",
    "text.5": "#888888",
    "text.6": "#999999",
    "text.7": "#bbbbbb",
    "text.8": "#cccccc",
    "text.9": "#dddddd",

    background: "#FFFFFF",
    "background.1": "#F2F2F2",
    "background.2": "#E6E6E6",
    "background.3": "#DBDBDB",
    "background.4": "#D0D0D0",
    "background.5": "#C4C4C4",
    "background.6": "#B2B2B2",
    "background.7": "#868686",
    "background.8": "#5A595A",
    "background.9": "#222222",

    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    danger: "#F96868",
    success: "rgb(54, 88, 56)",
    ...gray,
    ...primary,
  },
  dark: {
    text: "#F2F2F2",
    "text.1": "#F2F2F2",
    "text.2": "#E6E6E6",
    "text.3": "#DBDBDB",
    "text.4": "#D0D0D0",
    "text.5": "#B2B2B2",
    "text.6": "#999999",
    "text.7": "#868686",
    "text.8": "#4E4E4E",
    "text.9": "#4E4E4E",

    background: "#1e1e1e",
    "background.1": "#2E2E2E",
    "background.2": "#3E3E3E",
    "background.3": "#4D4D4D",
    "background.4": "#5D5D5D",
    "background.5": "#6D6D6D",
    "background.6": "#7D7D7D",
    "background.7": "#D0D0D0",
    "background.8": "#DBDBDB",
    "background.9": "#999999",

    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    danger: "#F96868",
    success: "rgb(54, 88, 56)",
    ...gray,
    ...primary,
  },
};
