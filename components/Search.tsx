import { useThemeColor } from "@/hooks/useThemeColor";
import React, { forwardRef, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "./ui/Icon";

type SearchProps = {
  onforceBlur?: () => void;
  onForceFocus?: () => void;
  size?: "sm" | "md" | "lg";
} & TextInputProps;

export const Search = forwardRef<TextInput, SearchProps>(
  ({ size = "md", ...props }, ref) => {
    // Temas
    const textColor = useThemeColor({}, "text.2");
    const backgroundColor = useThemeColor({}, "background.1");
    const clearButtonColor = useThemeColor({}, "background.2");
    const placeholderColor = useThemeColor({}, "text.5");
    const sizeStyles: StyleProp<ViewStyle> = [
      size === "sm" && { height: 32 },
      size === "md" && { height: 40 },
      size === "lg" && { height: 48 },
    ];

    // Estados
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Animação
    const width = useSharedValue(38);
    const animatedStyle = useAnimatedStyle(() => ({
      width: width.value,
    }));

    // Função para abrir/fechar o input
    const handleOpen = (open: boolean) => {
      width.value = withTiming(open ? 300 : 38);
      setIsFocused(open);
      props.onForceFocus?.();
      if (!open) {
        setInputValue("");
        props.onforceBlur?.();
      } // Limpa o input ao fechar
    };

    return (
      <Animated.View
        style={[
          styles.container,
          { backgroundColor },
          animatedStyle,
          sizeStyles,
        ]}
      >
        {/* Botão de pesquisa */}
        <Pressable
          style={styles.iconButton}
          onPress={() => handleOpen(!isFocused)}
        >
          <Icon name="search" size={18} colorName="text.5" />
        </Pressable>

        {/* Input */}
        <TextInput
          ref={ref}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Procurar Lista"
          placeholderTextColor={placeholderColor}
          style={[styles.input, { color: textColor }]}
          onFocus={(e) => {
            props.onFocus?.(e);
            handleOpen(true);
          }}
          onBlur={(e) => {
            props.onBlur?.(e);
            handleOpen(false);
          }}
          {...props}
        />

        {/* Botão de limpar */}
        {isFocused && (
          <Pressable
            style={[styles.clearButton, { backgroundColor: clearButtonColor }]}
            onPress={(e) => {
              handleOpen(false);
              props.onforceBlur?.();
              props.onChangeText?.("");
            }}
          >
            <Icon name="x" size={18} colorName="text.2" />
          </Pressable>
        )}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    borderRadius: 8,
    height: 38,
    alignItems: "center",
    paddingRight: 4,
    overflow: "hidden",

    backgroundColor: "blue",
  },
  iconButton: {
    height: 38,
    width: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 8,
  },
});
