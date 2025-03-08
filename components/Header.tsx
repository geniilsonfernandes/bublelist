import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Icon } from "./ui/Icon";
import { ThemedText } from "./ui/ThemedText";

type HeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  showBackButton?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  subtitle,
  title,
  children,
  containerStyle,
  style,
  showBackButton,
}) => {
  const router = useRouter();
  return (
    <View style={style}>
      {showBackButton ? (
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
          style={({ pressed }) => ({
            marginBottom: 48,
            height: 32,
            width: 32,
            borderRadius: 8,
            justifyContent: "center",
            opacity: pressed ? 0.5 : 1,
          })}
        >
          <Icon name="chevron-left" size={24} />
        </Pressable>
      ) : null}
      <ThemedText type="title.2">{title}</ThemedText>
      {subtitle ? <ThemedText type="body">{subtitle}</ThemedText> : null}
      <View style={containerStyle}>{children}</View>
    </View>
  );
};
