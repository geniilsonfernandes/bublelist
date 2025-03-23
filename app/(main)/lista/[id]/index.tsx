import { PillList } from "@/components/PillList";
import { ProductEntry } from "@/components/ProductEntry";
import { Search } from "@/components/Search";
import { Icon, IconProps } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useGetListById } from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateTotal, formatValue } from "@/utils/calculateTotal";
import { Stack, useLocalSearchParams } from "expo-router";
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

  // Estados
  const [search, setSearch] = useState("");
  const [showEntry, setShowEntry] = useState(true);
  const [filter, setFilter] = useState<(typeof OPTIONS)[number]>("Todos");

  // Filtragem dos produtos com base no search
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    return data.products.filter((product) => {
      if (search) {
        return product.name.toLowerCase().includes(search.toLowerCase());
      }
      if (filter === "Todos") return true;
      if (filter === "Marcados") return product.checked;
      if (filter === "Desmarcados") return !product.checked;
      return true;
    });
  }, [search, data?.products, filter]);

  // Cálculo total dos valores da lista
  const valuesSum = useMemo(
    () => ({
      total: calculateTotal(data?.products || []),
      formated: formatValue(calculateTotal(data?.products || [])),
    }),
    [data?.products]
  );

  const budget = useMemo(() => {
    if (!data?.budget) return "0";
    return formatValue(data.budget - valuesSum.total);
  }, [data?.budget, valuesSum.total]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerIcons}>
              <Icon name="menu" size={18} />
            </View>
          ),
        }}
      />
      <View
        style={{
          paddingHorizontal: 16,
        }}
      >
        <ThemedText type="title.3">{data?.name}</ThemedText>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText type="body" colorName="text.5">
            Orçamento: {formatValue(data?.budget || 0)} / {budget}
          </ThemedText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon name="shopping-cart" size={14} colorName="text.2" />
            <ThemedText type="body" colorName="text.5">
              Total: {valuesSum.formated}
            </ThemedText>
          </View>
        </View>
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
              label={value}
              active={value === filter}
              onPress={() => setFilter(value)}
              style={{
                marginLeft: 8,
              }}
            />
          ))}
        </ScrollView>
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <PillList data={filteredProducts} />
        {/* <Animated.FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          itemLayoutAnimation={LinearTransition}
          renderItem={renderList}
          ItemSeparatorComponent={() => (
            <ThemedView
              style={styles.separator}
              backgroundColor="background.1"
            />
          )}
          ListEmptyComponent={EmptyList}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
          keyboardShouldPersistTaps="always"
          getItemLayout={(data, index) => ({
            length: 50,
            offset: 50 * index,
            index,
          })}
        /> */}
      </View>
      {/* Entrada de produtos */}
      {showEntry && (
        <ThemedView backgroundColor="background.1" style={styles.productEntry}>
          <ProductEntry currentList={data} />
        </ThemedView>
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

const ActionButton: React.FC<ActionButtonProps> = ({
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
    paddingTop: 16,
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
    borderTopEndRadius: 32,
    borderTopStartRadius: 32,
  },
});
