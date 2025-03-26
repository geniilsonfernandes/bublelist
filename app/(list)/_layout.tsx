import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="new"
        options={{
          headerTitle: "Nova lista",
        }}
      />
      <Stack.Screen name="show/[id]/index" />
      <Stack.Screen name="edit" />
    </Stack>
  );
}
