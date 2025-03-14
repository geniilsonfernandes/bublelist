import { Product } from "@/components/Product";
import { ProductEntry } from "@/components/ProductEntry";
import { Icon } from "@/components/ui/Icon";
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
import Animated, { LinearTransition } from "react-native-reanimated";

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
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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

          headerRight(props) {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <Icon name="search" size={18} />
                <Icon name="menu" size={18} />
              </View>
            );
          },
        }}
      />
      <ThemedView
        style={{
          borderBottomEndRadius: 24,
          borderBottomStartRadius: 24,
          paddingBottom: 16,
          flex: 1,
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
            paddingBottom: 16,
          }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          data={data?.products || []}
          keyExtractor={(item) => item.id}
          itemLayoutAnimation={LinearTransition}
          renderItem={renderList}
          ItemSeparatorComponent={() => (
            <ThemedView
              style={styles.separator}
              backgroundColor="background.1"
            />
          )}
          initialNumToRender={20} // Number of items to render initially
          maxToRenderPerBatch={20} // Number of items to render per batch while scrolling
          windowSize={5} // Number of items to keep in memory
          keyboardShouldPersistTaps="always"
          getItemLayout={(data, index) => ({
            length: 50, // height of your list item
            offset: 50 * index,
            index,
          })}
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

  separator: {
    height: 1,
    marginHorizontal: 16,
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
    paddingHorizontal: 16,
  },
});
