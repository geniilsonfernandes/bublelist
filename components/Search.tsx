import { useThemeColor } from "@/hooks/useThemeColor";
import React, { forwardRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, TextInputProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "./ui/Icon";

type SearchProps = {
  onforceBlur?: () => void;
} & TextInputProps;

export const Search = forwardRef<TextInput, SearchProps>((props, ref) => {
  // Temas
  const textColor = useThemeColor({}, "text.2");
  const backgroundColor = useThemeColor({}, "background.1");
  const clearButtonColor = useThemeColor({}, "background.2");
  const placeholderColor = useThemeColor({}, "text.5");

  // Estados
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Animação
  const width = useSharedValue(42);
  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  // Função para abrir/fechar o input
  const handleOpen = (open: boolean) => {
    width.value = withTiming(open ? 300 : 42);
    setIsFocused(open);
    if (!open) setInputValue(""); // Limpa o input ao fechar
  };

  return (
    <Animated.View
      style={[styles.container, { backgroundColor }, animatedStyle]}
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
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    height: 42,
    width: 42,
    overflow: "hidden",
  },
  iconButton: {
    height: 42,
    width: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 42,
  },
  clearButton: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginRight: 8,
  },
});
