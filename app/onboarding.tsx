import { StatusBar, StyleSheet, useColorScheme, View } from "react-native";

import onboardDark from "../assets/images/onboard_1_dark.png";
import onboardLight from "../assets/images/onboard_1_light.png";

import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { useOnboardingStore } from "@/state/use-boarding-store";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

const features = [
  "⚡ Adição rápida",
  "💸 Orçamento",
  "📈 Histórico de preço",
  // "🛒 Modo compras",
  "🔒 Segurança",
];

export default function Onboarding() {
  const colorScheme = useColorScheme();

  const router = useRouter();
  const { setHasSeenOnboarding } = useOnboardingStore();

  function handleStart() {
    setHasSeenOnboarding(true);
    router.replace("/"); // ou onde fica tua Home
  }

  return (
    <ThemedView bg="background" style={styles.container}>
      {/* Imagem principal */}
      <View style={styles.imageContainer}>
        <Animated.Image
          source={colorScheme === "light" ? onboardLight : onboardDark}
          style={styles.image}
          resizeMode="contain"
          fadeDuration={0}
          entering={FadeInDown.duration(1000).delay(200)}
        />
      </View>

      {/* Título */}
      <Animated.View
        entering={FadeInDown.duration(1000).delay(500)}
        style={styles.content}
      >
        <ThemedText style={styles.title}>
          Modo avançado de criar listas de compras
        </ThemedText>

        {/* Features */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature}
              entering={FadeInDown.duration(800).delay(700 + index * 150)}
            >
              <ThemedText colorName="text.4" style={styles.feature} type="body">
                {feature}
              </ThemedText>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      {/* Botão */}
      <Animated.View
        entering={FadeInDown.duration(1000).delay(
          700 + features.length * 150 + 200
        )}
        style={styles.buttonContainer}
      >
        <Button onPress={handleStart} bg="background.2">
          Começar
        </Button>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: StatusBar.currentHeight,
    justifyContent: "space-between",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 24,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 16,
    fontFamily: "PlayfairDisplay-SemiBold",
    paddingHorizontal: 16,
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  feature: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  buttonContainer: {
    paddingTop: 16,
  },
});
