import dayjs from "dayjs";
import "dayjs/locale/pt-br"; // Importa o locale
import * as Haptics from "expo-haptics";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip } from "./Chip";
import { ThemedText } from "./ui/ThemedText";

dayjs.locale("pt-br");

export const LIST_NAME_SUGGESTIONS = [
  "Feira da Semana",
  `Lista de ${dayjs().format("MMMM")}`, // já está em pt-br
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
    <View style={styles.container}>
      <ThemedText type="body" colorName="text.4">
        Sugestões:
      </ThemedText>
      <FlatList
        data={LIST_NAME_SUGGESTIONS}
        horizontal
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 8 },
  separator: { width: 8 },
});
