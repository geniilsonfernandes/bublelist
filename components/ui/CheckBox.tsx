import { Pressable } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Icon } from "./Icon";
import { ThemedView } from "./ThemedView";

type CheckBoxProps = {
  value?: boolean;
  onChange?: (value: boolean) => void;
};

export const CheckBox: React.FC<CheckBoxProps> = ({ onChange, value }) => {
  return (
    <Pressable
      onPress={() => {
        onChange?.(!value);
      }}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      <ThemedView
        borderColor={value ? "background.4" : "background.3"}
        bg={value ? "background.3" : "background.5"}
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          opacity: value ? 1 : 0.5,
        }}
      >
        {value ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Icon
              name="check"
              size={16}
              colorName={value ? "text.3" : "background.5"}
            />
          </Animated.View>
        ) : null}
      </ThemedView>
    </Pressable>
  );
};
