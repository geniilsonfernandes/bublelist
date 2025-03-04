import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

type InputProps = {
  onIconPress?: () => void;
  iconName?: keyof typeof Feather.glyphMap;
  capBorder?: "top" | "bottom";
  rightSection?: React.ReactNode;
  isError?: boolean;
} & TextInputProps;
export const Input: React.FC<InputProps> = ({
  iconName,
  onChangeText,
  onIconPress,
  value,
  placeholder,
  capBorder,
  rightSection,
  isError,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View
      style={[
        styles.inputContainer,
        isFocused && styles.focus,
        capBorder === "top" && styles.capBorderTop,
        capBorder === "bottom" && styles.capBorderBottom,
        isError && styles.isError,
      ]}
    >
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.input]}
        onChangeText={onChangeText}
        placeholder={placeholder}
        value={value}
        {...props}
      />
      {rightSection ? (
        rightSection 
      ) : (
        <Feather
          name={iconName}
          size={18}
          style={styles.inputIcon}
          color="rgb(140, 140, 140)"
          onPress={onIconPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 4,
    backgroundColor: "rgb(243, 243, 243)",
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  input: {
    paddingHorizontal: 8,
    flex: 1,
    height: "100%",

  },
  inputIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    right: 16,
    alignSelf: "center",
  },
  rightSection: {
    right: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  focus: {
    borderColor: "rgb(220, 220, 220)",
  },
  isError: {
    borderColor: " rgb(242, 144, 144)",
  },
  capBorderTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  capBorderBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
