import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          animation: "fade_from_bottom",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          animation: "fade_from_bottom",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
