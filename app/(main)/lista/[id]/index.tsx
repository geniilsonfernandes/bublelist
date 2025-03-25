import { EmptyList } from "@/components/EmptyList";
import { PillList } from "@/components/PillList";
import { ProductEntry } from "@/components/ProductEntry";
import { Search } from "@/components/Search";
import { TotalBar } from "@/components/TotalBar";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon, IconProps } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useGetListById } from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useConfigStore } from "@/store/useConfigStore";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  PressableProps,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

  // Cálculo total dos valores da lista

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerRight: () => (
            <Pressable
              onPress={() => {
                router.push(`/(main)/settings/list`);
              }}
              style={styles.headerIcons}
            >
              <Icon name="more-vertical" size={18} />
            </Pressable>
          ),
        }}
      />
      <View
        style={{
          paddingHorizontal: 16,
          gap: 4,
        }}
      >
        <ThemedText type="title.3">{data?.name}</ThemedText>
      </View>

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

      <View
        style={{
          flex: 1,
          paddingTop: 10,
        }}
      >
        <PillList data={orderedProducts} ListEmptyComponent={<EmptyList />} />
        <TotalBar
          data={data?.products || []}
          show={show_total}
          budget={data?.budget || 0}
        />
      </View>
      {/* Entrada de produtos */}
      {showEntry && (
        <ProductEntry currentList={data} showSuggestions={show_suggestions} />
      )}
    </View>
  );
}

const AnimetedPressable = Animated.createAnimatedComponent(Pressable);

// Botão reutilizável para filtros e ações

type ActionButtonProps = {
  icon?: IconProps["name"];
  label: string;
  active?: boolean;
} & PressableProps;

const ActionButtonf: React.FC<ActionButtonProps> = ({
  icon,
  label,
  active,
  style,
  ...props
}) => {
  const backgroundColor = useThemeColor({}, "background.1");
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimetedPressable
      style={[style, animatedStyle]}
      onPressIn={() => {
        scale.value = withTiming(0.9);
      }}
      onPressOut={() => {
        scale.value = withTiming(1);
      }}
      {...props}
    >
      <ThemedView
        style={[
          [styles.actionButton],
          {
            opacity: active ? 1 : 0.4,
            backgroundColor,
          },
        ]}
      >
        {icon ? <Icon name={icon} size={16} colorName="text.2" /> : null}
        <ThemedText
          colorName="text.2"
          style={styles.ActionButtonLabel}
          type="defaultSemiBold"
        >
          {label}
        </ThemedText>
      </ThemedView>
    </AnimetedPressable>
  );
};

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
