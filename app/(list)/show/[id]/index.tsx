import { EmptyList } from "@/components/EmptyList";
import { PillList } from "@/components/PillList";
import { ProductEntry } from "@/components/ProductEntry";
import { Search } from "@/components/Search";
import { TotalBar } from "@/components/TotalBar";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useGetListById } from "@/database/useShoppingList";
import { useConfigStore } from "@/store/useConfigStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

const OPTIONS = ["Todos", "Marcados", "Desmarcados"] as const;

export default function ListShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useGetListById(id);
  const router = useRouter();
  const { show_suggestions, show_total, order_by } = useConfigStore();

  // Estados
  const [search, setSearch] = useState("");
  const [showEntry, setShowEntry] = useState(true);
  const [filter, setFilter] = useState<(typeof OPTIONS)[number]>("Todos");

  const orderedProducts = useMemo(() => {
    const sorted = [...(data?.products || [])];

    sorted.sort((a, b) => {
      // 1. Ordenar por campo selecionado
      if (order_by === "name") {
        return a.name.localeCompare(b.name);
      } else if (order_by === "quantity") {
        return b.quantity - a.quantity;
      } else if (order_by === "value") {
        return b.value - a.value;
      }

      return 0;
    });

    return sorted.filter((product) => {
      if (search) {
        return product.name.toLowerCase().includes(search.toLowerCase());
      }
      if (filter === "Todos") return true;
      if (filter === "Marcados") return product.checked;
      if (filter === "Desmarcados") return !product.checked;
      return true;
    });
  }, [search, data?.products, filter, order_by]);
  const statusBarHeight = StatusBar.currentHeight || 0;
  const height = Dimensions.get("screen").height;

  return (
    <ThemedView
      style={{
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          title: data?.name,
          headerTitleAlign: "center",
          headerShown: true,
          // headerTransparent: true,
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push(`/settings/list`);
              }}
              style={styles.headerIcons}
              hitSlop={8}
            >
              <Icon name="more-vertical" size={18} />
            </Pressable>
          ),
        }}
      />
      <View>
        <ScrollView
          style={styles.actionBar}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          <Search
            onFocus={() => setShowEntry(false)}
            onForceFocus={() => setShowEntry(false)}
            onforceBlur={() => setShowEntry(true)}
            onBlur={() => setShowEntry(true)}
            value={search}
            onChangeText={setSearch}
          />
          {OPTIONS.map((value) => (
            <ActionButton
              key={value}
              variant={filter === value ? "solid" : "outline"}
              onPress={() => setFilter(value)}
              style={{
                marginLeft: 8,
              }}
            >
              <ThemedText type="body">{value}</ThemedText>
            </ActionButton>
          ))}
        </ScrollView>
      </View>

      <PillList data={orderedProducts} ListEmptyComponent={<EmptyList />} />

      <View>
        <TotalBar
          data={data?.products || []}
          show={show_total}
          budget={data?.budget || 0}
        />
        {/* Entrada de produtos */}

        <ProductEntry currentList={data} showSuggestions={show_suggestions} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    borderBottomEndRadius: 24,
    borderBottomStartRadius: 24,
    paddingBottom: 16,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionBar: {
    paddingVertical: 8,
  },
  spacing: {
    width: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    height: 38,
    gap: 8,
    paddingHorizontal: 16,
  },
  ActionButtonLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  list: {
    paddingBottom: 48,
  },
  listContent: {
    paddingBottom: 48,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginVertical: 100,
  },
  cartSummary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    height: 38,
    gap: 8,
    paddingHorizontal: 16,
  },
  productEntry: {
    paddingHorizontal: 8,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
});
