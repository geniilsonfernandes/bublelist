import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Product } from "@/state/use-products-store";

import { calculateTotal, formatValue } from "@/utils/calculateTotal";
import { useMemo } from "react";
import { View } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";

type TotalBarProps = {
  data: Product[];
  budget: number;
  show?: boolean;
};

export function TotalBar({ data, show, budget }: TotalBarProps) {
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
    <Animated.View
      entering={FadeInDown.duration(200).easing(Easing.inOut(Easing.quad))}
      style={{
        marginHorizontal: 8,
      }}
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
    </Animated.View>
  );
}
