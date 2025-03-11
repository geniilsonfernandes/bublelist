import { Product } from "@/components/Product";
import { ProductEntry } from "@/components/ProductEntry";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  Product as ProductType,
  useGetListById,
} from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { calculateTotal, formatValue } from "@/utils/calculateTotal";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
} from "react-native-reanimated";

export default function ListShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useGetListById(id);
  const iconColor = useThemeColor({}, "primary.100");

  const valuesSum = useMemo(
    () => calculateTotal(data?.products || []),
    [data?.products]
  );
  const budget = useMemo(() => formatValue(data?.budget || 0), [data?.budget]);

  const renderList = useCallback(
    ({ item }: { item: ProductType }) => <Product {...item} />,
    []
  );

  if (isLoading) {
    return (
      <ThemedView style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <ActivityIndicator size="large" color={iconColor} />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      backgroundColor="background.1"
      style={{
        flex: 1,
      }}
    >
        <Stack.Screen
          options={{
            title: data?.name,
            headerShown: true,
          }}
        />
      <ThemedView
        style={{
          flex: 1,

          borderBottomEndRadius: 24,
          borderBottomStartRadius: 24,
          paddingBottom: 16,
        }}
      >
        <View style={styles.stats}>
          <ThemedText colorName="text.3" type="body">
            {data?.products.length || 0} produtos
          </ThemedText>
          <ThemedText colorName="text.3" type="body">
            {budget} / {valuesSum}
          </ThemedText>
        </View>

        <Animated.FlatList
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
          data={data?.products || []}
          keyExtractor={(item) => item.id}
          itemLayoutAnimation={LinearTransition}
          entering={FadeIn.duration(200).easing(Easing.inOut(Easing.quad))}
          renderItem={renderList}
          keyboardShouldPersistTaps="always"
        />
      </ThemedView>
      <ThemedView backgroundColor="background.1" style={styles.productEntry}>
        <ProductEntry currentList={data} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomEndRadius: 24,
    borderBottomStartRadius: 24,
    paddingBottom: 16,
  },

  iconButton: {
    padding: 4,
    borderRadius: 8,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  productEntry: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
