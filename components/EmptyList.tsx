import { StyleSheet } from "react-native";
import { Icon, IconProps } from "./ui/Icon";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

type EmptyListProps = {
  message?: string;
  subMessage?: string;
  icon?: IconProps["name"];
};

const DEFAULT_ICON = "inbox";
const DEFAULT_MESSAGE = "Nenhum produto encontrado";
const DEFAULT_SUB_MESSAGE = "Adicione produtos a lista";

export const EmptyList: React.FC<EmptyListProps> = ({
  icon = DEFAULT_ICON,
  message = DEFAULT_MESSAGE,
  subMessage = DEFAULT_SUB_MESSAGE,
}) => (
  <ThemedView style={styles.emptyList} backgroundColor="background">
    <Icon name={icon} size={48} colorName="text.4" />
    <ThemedText colorName="text.2" type="defaultSemiBold">
        {message}
    </ThemedText>
    <ThemedText colorName="text.5" type="default">
        {subMessage}
    </ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginVertical: 100,
  },
});
