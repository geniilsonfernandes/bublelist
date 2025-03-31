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
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="new"
        options={{
          headerTitle: "Nova lista",
        }}
      />
      <Stack.Screen
        name="show/[id]/index"
        options={{
          animation: "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="show/[id]/edit"
        options={{
          headerTitle: "Editar lista",
          animation: "fade_from_bottom",
        }}
      />
      <Stack.Screen
        name="product"
        options={{
          headerTitle: "editar produto",
          animation: "fade_from_bottom",
          presentation: "transparentModal",
        }}
      />
    </Stack>
  );
}
