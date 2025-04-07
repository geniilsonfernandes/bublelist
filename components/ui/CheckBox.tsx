import { Pressable } from "react-native";
import Animated, { BounceIn, BounceOut } from "react-native-reanimated";
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
        borderColor={value ? "primary.100" : "background.3"}
        bg={value ? "primary.100" : "background.2"}
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value ? (
          <Animated.View
            entering={BounceIn.duration(300)}
            exiting={BounceOut.duration(300)}
          >
            <Icon name="check" size={16} colorName="gray.100" />
          </Animated.View>
        ) : null}
      </ThemedView>
    </Pressable>
  );
};
