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
            })}
          >
            <Icon name="chevron-left" size={24} />
          </Pressable>
        ),

        headerStyle: {
          backgroundColor,
        },

        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="lista/new"
        options={{
          animation: "fade_from_bottom",
          headerTitle: "Nova lista",
        }}
      />
      <Stack.Screen
        name="lista/[id]/index"
        options={{
          animation: "fade_from_bottom",

          headerShown: false,
        }}
      />
      <Stack.Screen
        name="lista/[id]/edit"
        options={{
          animation: "fade_from_bottom",
          headerTitle: "Editar lista",
        }}
      />
    </Stack>
  );
}
