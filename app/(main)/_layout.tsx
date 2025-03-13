import { Icon } from "@/components/ui/Icon";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function RootLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const backgroundButton = useThemeColor({}, "background.1");
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              padding: 4,
              borderRadius: 8,
              marginRight: 16,
              backgroundColor: backgroundButton,
              opacity: pressed ? 0.5 : 1,
              transform: [{ scale: pressed ? 0.88 : 1 }],
            })}
          >
            <Icon name="chevron-left" size={24} />
          </Pressable>
        ),

        headerStyle: {
          backgroundColor,
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
