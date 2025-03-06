import { Product } from "@/components/Product";
import { ProductEntry } from "@/components/ProductEntry";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  Product as ProductType,
  useGetListById,
} from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useModals } from "@/store/useModals";
import { calculateTotal, formatValue } from "@/utils/calculateTotal";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function ListView() {
  const iconColor = useThemeColor({}, "text.2");
  const { setSelectedList } = useModals();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useGetListById(id);

  const valuesSum = useMemo(
    () => calculateTotal(data?.products || []),
    [data?.products]
  );
  const budget = useMemo(() => formatValue(data?.budget || 0), [data?.budget]);

  const handleOpenListDetails = () => {
    if (data) setSelectedList(data);
  };

  const renderList = useCallback(
    ({ item }: { item: ProductType }) => <Product {...item} />,
    []
  );

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={router.back}>
          <Feather name="chevron-left" size={24} color={iconColor} />
        </Pressable>
        <ThemedText type="title.3">{data?.name}</ThemedText>
        <Pressable style={styles.iconButton} onPress={handleOpenListDetails}>
          <Feather name="edit" size={18} color={iconColor} />
        </Pressable>
      </View>
      <View style={styles.stats}>
        <ThemedText colorName="text.3" type="body">
          {data?.products.length || 0} produtos
        </ThemedText>
        <ThemedText colorName="text.3" type="body">
          {budget} / {valuesSum}
        </ThemedText>
      </View>

      <Animated.FlatList
        data={data?.products || []}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition}
        renderItem={renderList}
        keyboardShouldPersistTaps="always"
      />

      <View style={styles.productEntry}>
        <ProductEntry currentList={data} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconButton: {
    padding: 4,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  productEntry: {
    marginVertical: 8,
  },
});
