import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { ThemedText } from "./ui/ThemedText";

type HeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export const Header: React.FC<HeaderProps> = ({
  subtitle,
  title,
  children,
  containerStyle,
  style,
}) => {
  return (
    <View style={style}>
      <ThemedText type="title.2">{title}</ThemedText>
      {subtitle ? <ThemedText type="body">{subtitle}</ThemedText> : null}
      <View style={containerStyle}>{children}</View>
    </View>
  );
};
