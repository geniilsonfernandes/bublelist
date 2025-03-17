import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function AnimatedBorder({
  children,
}: {
  children: React.ReactNode;
}) {
  const borderAnimation = useSharedValue(0);

  useEffect(() => {
    borderAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        borderAnimation.value,
        [0, 1],
        ["#FF5733", "#338BFF"]
      ),
    };
  });

  return (
    <Animated.View style={[styles.box, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 48,
    overflow: "hidden",
  },
});
