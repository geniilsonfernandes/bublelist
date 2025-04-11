import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Product } from "@/state/use-products-store";

import { calculateTotal, formatValue } from "@/utils/calculateTotal";
import { useMemo } from "react";
import { Pressable, View } from "react-native";

type TotalBarProps = {
  data: Product[];
  budget: number;
  show?: boolean;
  onPress?: () => void;
};

export function TotalBar({ data, show, budget, onPress }: TotalBarProps) {
  const values = useMemo(() => {
    const total = calculateTotal(data || []);
    return {
      budget: formatValue(budget || 0),
      total: formatValue(total),
      checkedFormatted: formatValue((budget || 0) - total),
      checked: (budget || 0) - total,
    };
  }, [data]);

  if (!show) return null;

  return (
    <Pressable
      style={(props) => ({
        opacity: props.pressed ? 0.5 : 1,
        transform: [{ scale: props.pressed ? 0.95 : 1 }],
        marginHorizontal: 8,
      })}
      onPress={onPress}
    >
      <ThemedView
        bg="background.1"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 24,
          borderRadius: 8,
          padding: 8,
          paddingHorizontal: 16,
          marginBottom: 8,
        }}
      >
        <View>
          <ThemedText type="defaultSemiBold" colorName="text.5">
            Orçamento:
          </ThemedText>
          <ThemedText
            type="body"
            colorName={values.checked < 0 ? "danger" : "text.5"}
          >
            {values.budget} / {values.checkedFormatted}
          </ThemedText>
        </View>

        <View>
          <ThemedText type="defaultSemiBold" colorName="text.5">
            Total:
          </ThemedText>
          <ThemedText type="body" colorName="text.5">
            {values.total}
          </ThemedText>
        </View>
      </ThemedView>
    </Pressable>
  );
}
