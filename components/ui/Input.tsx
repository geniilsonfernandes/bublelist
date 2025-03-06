import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { forwardRef } from "react";
import { Pressable, StyleSheet, TextInput, TextInputProps } from "react-native";
import { ThemedView } from "./ThemedView";

type InputProps = {
  onActionClick?: () => void;
  rightSection?: React.ReactNode;
  iconName?: keyof typeof Feather.glyphMap;
  showActions?: boolean;
  cap?: "top" | "bottom";
} & TextInputProps;

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      onActionClick,
      rightSection,
      iconName = "check",
      showActions = true,
      cap,
      ...rest
    },
    ref
  ) => {
    const textColor = useThemeColor({}, "text.2");
    const placeholderTextColor = useThemeColor({}, "text.3");
    const iconColor = useThemeColor({}, "primary.100");

    return (
      <ThemedView
        borderColor={"background.2"}
        style={[
          styles.container,
          cap === "bottom" && styles.capBottom,
          cap === "top" && styles.capTop,
        ]}
      >
        <TextInput
          ref={ref}
          placeholder="Digite o nome do produto"
          style={[
            styles.input,
            {
              color: textColor,
            },
          ]}
          placeholderTextColor={placeholderTextColor}
          {...rest}
        />
        {showActions ? (
          <>
            {rightSection ? (
              rightSection
            ) : (
              <>
                {rest.value ? (
                  <Pressable
                    onPress={onActionClick}
                    style={[
                      styles.icon,
                      {
                        backgroundColor: iconColor,
                      },
                    ]}
                    disabled={!rest.value}
                  >
                    <Feather name={iconName} size={16} color="#fff" />
                  </Pressable>
                ) : null}
              </>
            )}
          </>
        ) : null}
      </ThemedView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,

    padding: 4,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 40,
    padding: 8,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  capBottom: {
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
  },
  capTop: {
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
});
