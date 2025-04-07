import {
  Image,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

import onboardDark from "../assets/images/onboard_1_dark.png";
import onboardLight from "../assets/images/onboard_1_light.png";

import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useOnboardingStore } from "@/store/onboardingStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const features = [
  "⚡ Adição rápida",
  "💸 Orçamento",
  // "🔔 Notificações",
  // "🤝 Compartilhamento",
  "📈 Histórico de preço",
  "🛒 Modo compras",
  // "👥 Compartilhamento de listas",
  // "🛍️ Modo compras"
  "🔒 Segurança",
  "📊 Relatórios",
];

export default function Onboarding() {
  const backgroundColor = useThemeColor({}, "background.1");
  const backgroundColor2 = useThemeColor({}, "background");
  const colorScheme = useColorScheme();

  const router = useRouter();
  const { setHasSeenOnboarding } = useOnboardingStore();

  function handleStart() {
    setHasSeenOnboarding(true);
    router.replace("/"); // ou onde fica tua Home
  }

  return (
    <LinearGradient
      colors={[backgroundColor, backgroundColor2]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Imagem principal */}
      <View style={styles.imageContainer}>
        <Image
          source={colorScheme === "light" ? onboardLight : onboardDark}
          style={styles.image}
          resizeMode="contain"
          fadeDuration={0}
        />
      </View>

      {/* Título e Features */}
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          Modo avançado de criar listas de compras
        </ThemedText>

        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <ThemedText
              key={feature}
              colorName="text.4"
              style={styles.feature}
              type="body"
            >
              {feature}
            </ThemedText>
          ))}
        </View>
      </View>

      {/* Botão */}
      <View style={styles.buttonContainer}>
        <Button onPress={handleStart} bg="background.1">
          Começar
        </Button>
      </View>
    </LinearGradient>
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
    backgroundColor: "rgba(0, 0, 0, 00.1)",
    overflow: "hidden",
  },
  buttonContainer: {
    paddingTop: 16,
  },
});
