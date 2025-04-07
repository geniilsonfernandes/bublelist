import { useColorScheme } from "@/hooks/useColorScheme";
import Entypo from "@expo/vector-icons/Entypo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Font from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { useOnboardingStore } from "@/store/onboardingStore";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loadHasSeenOnboarding = useOnboardingStore(
    (s) => s.loadHasSeenOnboarding
  );
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();
  const [loaded] = Font.useFonts({
    "PlayfairDisplay-SemiBold": require("../assets/fonts/PlayfairDisplay-SemiBold.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        loadHasSeenOnboarding();
        await Font.loadAsync(Entypo.font);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady && loaded) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Slot />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
