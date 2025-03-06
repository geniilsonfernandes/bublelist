import dayjs from "dayjs";
import * as Haptics from "expo-haptics";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip } from "./Chip";
import { ThemedText } from "./ui/ThemedText";

export const LIST_NAME_SUGGESTIONS = [
  "Feira da Semana",
  `Lista de ${dayjs().locale("pt-br").format("MMMM")}`,
  `${dayjs().format("DD/MM/YYYY")}`,
  "Compras Mensais",
  "Itens de Padaria",
  "Carnes e Frios",
  "Produtos de Limpeza",
  "Farmácia",
  "Lanches e Snacks",
  "Café da Manhã",
  "Churrasco",
  "Jantar Especial",
];

type ListNameSuggestionsProps = {
  onAcceptSuggestion: (name: string) => void;
};

export const ListNameSuggestions: React.FC<ListNameSuggestionsProps> = ({
  onAcceptSuggestion,
}) => {
  return (
    <>
      <ThemedText type="body" style={styles.suggestionTitle} colorName="text.4">
        Sugestões:
      </ThemedText>
      <FlatList
        data={LIST_NAME_SUGGESTIONS}
        horizontal
        contentContainerStyle={styles.suggestionContainer}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onAcceptSuggestion(item);
            }}
          >
            <Chip label={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </>
  );
};

const styles = StyleSheet.create({
  suggestionContainer: { marginTop: 8 },
  suggestionTitle: { marginTop: 8 },

  separator: { width: 8 },
});
