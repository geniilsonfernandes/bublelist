import { useThemeColor } from "@/hooks/useThemeColor";
import { View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
} from "react-native-reanimated";
const AnimatedView = Animated.createAnimatedComponent(View);

export const SkeletonItem = () => {
  const backgroundColor = useThemeColor({}, "background.1");
  const opacity = useSharedValue(1); // Opacidade inicial é 1

  // Estilo animado com loop
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSpring(opacity.value, {
        damping: 10,
        stiffness: 100,
      }),
      -1, // O número -1 significa que a animação será repetida indefinidamente
      true // A animação irá alternar entre opacidade 1 e 0.5 (direção reversa)
    ),
    backgroundColor: backgroundColor, // Cor de fundo fixa, sem animação
  }));

  // Altera a opacidade para 0.5

    

  return (
    <AnimatedView
      style={[
        {
          height: 70,
          borderRadius: 8,
          overflow: "hidden",
          backgroundColor: backgroundColor, // Cor de fundo definida como padrão
        },
        animatedStyle, // Aplica a animação de opacidade
      ]}
    />
  );
};
