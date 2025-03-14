import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { forwardRef } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

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
    const backgroundColor = useThemeColor({}, "background");
    const placeholderTextColor = useThemeColor({}, "text.3");
    const iconColor = useThemeColor({}, "primary.100");

    return (
      <View style={[styles.container]}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: textColor,
              backgroundColor,
            },
          ]}
          placeholderTextColor={placeholderTextColor + "80"}
          {...rest}
        />
        {showActions ? (
          <>
            {rightSection ? (
              rightSection
            ) : (
              <>
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
                  <Feather
                    name={!rest.value ? "mic" : "shopping-bag"}
                    size={16}
                    color="#fff"
                  />
                </Pressable>
              </>
            )}
          </>
        ) : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    height: 48,
    padding: 8,
    borderRadius: 50,
  },
  icon: {
    width: 48,
    height: 48,

    borderRadius: 48,
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
