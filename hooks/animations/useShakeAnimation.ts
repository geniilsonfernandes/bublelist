import { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

export const useShakeAnimation = () => {
  const offsetX = useSharedValue(0);
  // Função que vai ser chamada quando o botão for pressionado
  // Função que vai ser chamada quando o botão for pressionado
  const startShake = () => {
    offsetX.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 100 }),
        withTiming(0, { duration: 100 })
      )
    );
  };

  // Aplica a animação no estilo do componente
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }],
  }));

  return { startShake, animatedStyle };
};