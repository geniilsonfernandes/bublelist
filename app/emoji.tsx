import { ActionButton, ActionButtonProps } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { colors, emojiCategories } from "@/constants/list";
import { useEmojiStore } from "@/store/useEmojiStore";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type EmojiProps = {
  color?: string;
  emoji?: string;
  showButton?: boolean;
} & ActionButtonProps;

export const Emoji: React.FC<EmojiProps> = ({
  color,
  emoji,
  showButton = false,
  ...props
}) => {
  const fontSize = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 30,
    xxl: 56,
    large: 64,
  } as Record<"sm" | "md" | "lg" | "xl" | "xxl" | "large", number>;

  return (
    <ActionButton
      bg="background.1"
      variant="solid"
      style={{
        alignItems: "center",
        justifyContent: "center",

        borderRadius: 8,
        alignSelf: "center",
        backgroundColor: color + "60",
      }}
      size="large"
      {...props}
    >
      <Text
        style={{
          fontSize: fontSize[props.size || "md"],
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {emoji}
      </Text>
      {showButton && (
        <ThemedView
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: 6,
            borderRadius: 4,
          }}
          bg="background.3"
        >
          <Icon name="edit" size={14} color="#C5C5C5" />
        </ThemedView>
      )}
    </ActionButton>
  );
};

type ColorButtonProps = {
  active: boolean;
  onPress: () => void;
  color: string;
};

const ColorButton: React.FC<ColorButtonProps> = ({
  color,
  onPress,
  active,
}) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 8,
        width: 56,
        height: 56,

        alignSelf: "center",
        backgroundColor: color,
      }}
      onPress={onPress}
    >
      {active && <Icon name="check" size={16} color="white" />}
    </TouchableOpacity>
  );
};

export default function EmojiPage() {
  const {
    background,
    emoji: emojiSelected,
    setBackground,
    setEmoji,
  } = useEmojiStore();

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
      >
        <View style={{ justifyContent: "center", marginVertical: 48 }}>
          <Emoji color={background} emoji={emojiSelected} />
        </View>
        <ThemedText type="defaultSemiBold">Cor</ThemedText>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 16,
            marginVertical: 16,
          }}
        >
          {colors.map((color) => (
            <ColorButton
              key={color}
              color={color}
              onPress={() => setBackground(color)}
              active={background === color}
            />
          ))}
        </View>

        {emojiCategories.map((category) => (
          <View key={category.title}>
            <ThemedText type="defaultSemiBold">{category.title}</ThemedText>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 16,
                marginVertical: 16,
              }}
            >
              {category.data.map((emoji) => (
                <Emoji
                  size="xl"
                  key={emoji}
                  emoji={emoji}
                  onPress={() => setEmoji(emoji)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
