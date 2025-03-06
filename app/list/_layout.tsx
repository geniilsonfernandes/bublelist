import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";


export default function RootLayout() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: backgroundColor },
        contentStyle: { flex: 1, backgroundColor: backgroundColor },
      }}
    >
      <Stack.Screen name="index" options={{ headerShadowVisible: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
