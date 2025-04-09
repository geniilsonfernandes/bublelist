import { Colors } from "@/constants/Colors";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
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

const queryClient = new QueryClient();

// Evita o splash sumir sozinho:
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
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
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ThemeProvider value={DarkTheme}>
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: Colors.dark["background"],
                },
                headerTintColor: "#fff",
                headerShadowVisible: false,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="list/[id]/index"
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="new-list"
                options={{
                  animation: "slide_from_right",
                  headerBackTitle: "Voltar",
                  headerTitle: "Criar nova lista",
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
            </Stack>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
