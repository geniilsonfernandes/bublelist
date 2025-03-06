/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const backgroundDark = {
  100: "#151718",
};
const primary = {
  100: "#0a7ea4",
  200: "#0077b6",
  300: "#0068a5",
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

    background: "#FCFDFC",
    "background.1": "#F2F2F2",
    "background.2": "#E6E6E6",
    "background.3": "#DBDBDB",
    "background.4": "#D0D0D0",
    "background.5": "#C4C4C4",
    "background.6": "#B2B2B2",
    "background.7": "#868686",
    "background.8": "#5A595A",
    "background.9": "#2D2E2F",

    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    danger: "#F96868",
    success: "rgb(87, 206, 87)",
    ...gray,
    ...primary,
  },
  dark: {
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

    background: "#FCFDFC",
    "background.1": "#F2F2F2",
    "background.2": "#E6E6E6",
    "background.3": "#DBDBDB",
    "background.4": "#D0D0D0",
    "background.5": "#C4C4C4",
    "background.6": "#B2B2B2",
    "background.7": "#868686",
    "background.8": "#4E4E4E",
    "background.9": "#2D2E2F",

    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    danger: "#F96868",
    success: "rgb(87, 206, 87)",
    ...gray,
    ...primary,
  },
};

