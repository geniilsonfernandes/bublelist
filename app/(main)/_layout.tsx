import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";

export default function RootLayout() {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTitleStyle: {
          fontSize: 18,
        },
        contentStyle: {
          backgroundColor,
        },

        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="lista/new"
        options={{
          headerTitle: "Nova lista",
        }}
      />
      <Stack.Screen
        name="lista/[id]/index"
        options={{
          animation: "fade",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="lista/[id]/edit"
        options={{
          headerTitle: "Editar lista",
        }}
      />
      <Stack.Screen
        name="settings/delete-data"
        options={{
          headerTitle: "Deletar dados",
        }}
      />
      <Stack.Screen
        name="settings/export-data"
        options={{
          headerTitle: "Exportar dados",
        }}
      />
    </Stack>
  );
}
