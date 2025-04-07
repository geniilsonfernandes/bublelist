import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import React from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function AppIndexLayout() {
  const backgroundColor = useThemeColor({}, "background");
  //   const { user } = useUser();
  //   const networkState = useNetworkState();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Início",
          headerShown: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="list/new/index"
        options={{
          title: "Nova lista",
          animation: "slide_from_right",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="list/[id]/index"
        options={{
          animation: "slide_from_right",
          headerBackTitle: "Voltar",
        }}
      />
      <Stack.Screen
        name="list/[id]/edit"
        options={{
          animation: "slide_from_right",
          headerBackTitle: "Voltar",
          title: "Editar lista",
        }}
      />
      <Stack.Screen
        name="list/[id]/product"
        options={{
          animation: "fade_from_bottom",
          presentation: "transparentModal",
          title: "Editar produto",
        }}
      />
    </Stack>
  );
}
