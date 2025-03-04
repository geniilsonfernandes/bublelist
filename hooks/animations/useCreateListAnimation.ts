import { useState } from "react";
import { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const CLOSED_POSITION = -310;
export const useCreateListAnimation = () => {
  const [opened, setOpenned] = useState(false);
  const position = useSharedValue(0);
  const gap = useSharedValue(8);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    bottom: position.value,
    gap: gap.value,
  }));

  const toggleOpen = () => {
    setOpenned(!opened);
    position.value = withSpring(opened ? 0 : CLOSED_POSITION, {
      mass: 1,
      damping: 20,
      stiffness: 100,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 2,
      reduceMotion: ReduceMotion.System,
    });
    gap.value = withSpring(opened ? 8 : 16, { duration: 300 });
  };

  return { animatedSheetStyle, toggleOpen, opened };
};

