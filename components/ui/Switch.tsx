import { Colors } from "@/constants/Colors";
import React from "react";
import { Pressable } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export function Switch({
  initial = false,
  onChange,
}: {
  initial?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const translateX = useSharedValue(initial ? 25 : 0);
  const isOn = useSharedValue(initial);

  const trackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isOn.value ? "transparent" : Colors.dark["primary.100"],
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  function toggle() {
    isOn.value = !isOn.value;
    translateX.value = withTiming(isOn.value ? 20 : -5, { duration: 200 });
    onChange?.(isOn.value);
  }

  return (
    <Pressable onPress={toggle} style={{ width: 50, height: 30, padding: 5 }}>
      <Animated.View
        style={[
          {
            flex: 1,
            borderRadius: 999,
            justifyContent: "center",
            borderWidth: 1,
            borderColor: Colors.dark["gray.400"],
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: 25,
              height: 25,
              borderRadius: 50,
              backgroundColor: "white",
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
