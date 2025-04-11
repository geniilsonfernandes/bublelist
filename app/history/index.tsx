import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Product, useProductsStore } from "@/state/use-products-store";
import { formatValue } from "@/utils/calculateTotal";
import { SectionList, StyleSheet, Text, View } from "react-native";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";

// Ativa os plugins
dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const groupByDate = (items: Product[]) => {
  const grouped = items.reduce((acc: Record<string, Product[]>, item) => {
    const date = item.purchasedAt || "Sem Data";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, Product[]>);

  return Object.keys(grouped).map((date) => ({
    title: date,
    data: grouped[date],
  }));
};

// Função para transformar a data em "Hoje", "Ontem", ou a data mesmo
const formatDateLabel = (dateString: string) => {
  const parsedDate = dayjs(dateString, "DD/MM/YYYY");

  if (parsedDate.isToday()) {
    return "Hoje";
  }
  if (parsedDate.isYesterday()) {
    return "Ontem";
  }
  return parsedDate.format("DD [de] MMMM [de] YYYY");
};

export default function History() {
  const { history, clearHistory } = useProductsStore();

  const sections = groupByDate(history);

  return (
    <ThemedView
      bg="background"
      style={{
        flex: 1,
      }}
    >
      
      <SectionList
        
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item: product }) => (
          <ThemedView style={styles.productItem}>
            <ThemedText
              style={styles.productName}
              colorName="text.1"
              type="body"
            >
              {product.name}
            </ThemedText>
            <ThemedText type="body" colorName="text.6">
              {formatValue(product.value * product.quantity)}
            </ThemedText>
          </ThemedView>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.headerContainer}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {formatDateLabel(title)}
            </Text>
          </View>
        )}
        renderSectionFooter={({ section: { data } }) => (
          <View style={styles.footerSeparator}>
            <View style={styles.footerTotal}>
              <ThemedText type="body">Total:</ThemedText>
              <ThemedText type="body">
                {formatValue(
                  data.reduce(
                    (acc, item) => acc + item.value * item.quantity,
                    0
                  )
                )}
              </ThemedText>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  headerContainer: {
    margin: 16,
    gap: 8,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemSeparator: {
    height: 4,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  productName: {
    flex: 1,
    maxWidth: "80%",
  },
  footerSeparator: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  footerTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
