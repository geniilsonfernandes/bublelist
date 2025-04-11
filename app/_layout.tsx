import { Colors } from "@/constants/Colors";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Evita o splash sumir sozinho:
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useColorScheme() ?? "light";
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded] = Font.useFonts({
    "PlayfairDisplay-SemiBold": require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      if (loaded) {
        setAppIsReady(true);
        await SplashScreen.hideAsync(); // <-- Quando tudo tá pronto, esconde
      }
    }

    prepare();
  }, [loaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <BottomSheetModalProvider>
        <StatusBar
          backgroundColor={
            theme === "dark" ? Colors.dark.background : Colors.light.background
          }
        />
        <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor:
                  theme === "dark"
                    ? Colors.dark.background
                    : Colors.light.background,
              },

              headerShadowVisible: false,
              headerTintColor:
                theme === "dark"
                  ? Colors.dark["text.2"]
                  : Colors.light["text.2"],
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,

                animation: "fade_from_bottom",
                headerTransparent: true,
              }}
            />
            <Stack.Screen
              name="onboarding"
              options={{
                headerShown: false,

                animation: "fade_from_bottom",
              }}
            />
            <Stack.Screen
              name="list/[id]/index"
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="list/[id]/summary"
              options={{
                animation: "fade_from_bottom",
                headerTitle: "Resumo",
              }}
            />
            <Stack.Screen
              name="list/[id]/product"
              options={{
                animation: "fade",
                presentation: "transparentModal",
                headerTitle: "Editar produto",
              }}
            />
            <Stack.Screen
              name="history/index"
              options={{
                animation: "fade_from_bottom",
                headerTitle: "Histórico",
              }}
            />
            <Stack.Screen
              name="new-list"
              options={{
                animation: "slide_from_right",
                headerBackTitle: "Voltar",
              }}
            />
            <Stack.Screen
              name="settings/geral"
              options={{
                animation: "slide_from_right",
                headerBackTitle: "Voltar",
                headerTitle: "Configurações",
              }}
            />
            <Stack.Screen
              name="settings/export-data"
              options={{
                animation: "slide_from_right",
                headerBackTitle: "Voltar",
                headerTitle: "Exportar dados",
              }}
            />
            <Stack.Screen
              name="settings/delete-data"
              options={{
                animation: "slide_from_right",
                headerBackTitle: "Voltar",
                headerTitle: "Exportar dados",
              }}
            />
            <Stack.Screen
              name="settings/privacy-policy"
              options={{
                animation: "slide_from_right",
                headerBackTitle: "Voltar",
                headerTitle: "Politica de privacidade",
              }}
            />
            <Stack.Screen
              name="settings/feedback"
              options={{
                animation: "slide_from_right",
                headerBackTitle: "Voltar",
                headerTitle: "Fale com o desenvolvedor",
              }}
            />
          </Stack>
          {/* <StatusBar style="dark" translucent /> */}
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
