import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useFindListById } from "@/state/use-list-store";
import { calculateTotal, formatValue } from "@/utils/calculateTotal";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function Total() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const list = useFindListById(id);
  return (
    <ThemedView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
      }}
    >
      <FlashList
        data={list?.products}
        estimatedItemSize={50}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 16,
            gap: 8
          

           }}>
            <ThemedText colorName="text.1" type="title">
              {list?.name}
            </ThemedText>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ThemedText colorName="text.1" type="body">
                {list?.budget && formatValue(list.budget)}
              </ThemedText>
              <ThemedText colorName="text.1" type="body">
                {list?.products?.length} produtos
              </ThemedText>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        renderItem={({ item }) => {
          return (
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ThemedText
                style={{ flex: 1, maxWidth: "80%" }}
                colorName="text.1"
                type="body"
              >
                {item.name}
              </ThemedText>
              <ThemedText type="body" colorName="text.6">
                {formatValue(item.value)} x {item.quantity}
              </ThemedText>
            </ThemedView>
          );
        }}
        ListFooterComponent={() => (
          <>
            <ThemedView
              style={{
                height: 1,
                width: "100%",
                marginVertical: 8,
              }}
              bg="background.1"
            />
            <ThemedView
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <ThemedText colorName="text.1" type="body">
                Total
              </ThemedText>
              <ThemedText type="body" colorName="text.6">
                {formatValue(calculateTotal(list?.products || [], "all"))}
              </ThemedText>
            </ThemedView>
          </>
        )}
        keyExtractor={(item) => item.id}
      />
      <Button variant="solid" leftIcon="paperclip">
        Hitorico de compras
      </Button>
    </ThemedView>
  );
}
