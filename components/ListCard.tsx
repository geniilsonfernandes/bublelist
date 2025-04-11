import { useThemeColor } from "@/hooks/useThemeColor";
import { type List } from "@/state/use-list-store";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "./ui/Icon";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ListProps = {
  onPress: () => void;
  onClickToDelete?: () => void;
  onClickToEdit?: () => void;
  onClickToShare?: () => void;
  onClickToOptions?: () => void;
  style?: any;
} & List;

const HEIGHT = 150;
const HEIGHT_EXPANDED = 138;

const s = {
  debug: {
    borderWidth: 1,
  },
  mb_sm: {
    marginBottom: 8,
  },
  mb_md: {
    marginBottom: 16,
  },
  mb_lg: {
    marginBottom: 24,
  },
  p_xs: {
    padding: 4,
  },
  p_sm: {
    padding: 8,
  },
  p_md: {
    padding: 16,
  },
  p_lg: {
    padding: 24,
  },
  radius_xs: {
    borderRadius: 4,
  },
  radius_sm: {
    borderRadius: 8,
  },

  flex: {
    display: "flex",
  },
  flex_col: {
    flexDirection: "column",
  },
  flex_row: {
    flexDirection: "row",
  },
  flex_col_reverse: {
    flexDirection: "column-reverse",
  },
  flex_row_reverse: {
    flexDirection: "row-reverse",
  },
  flex_wrap: {
    flexWrap: "wrap",
  },
  flex_nowrap: {
    flexWrap: "nowrap",
  },

  justify_start: {
    justifyContent: "flex-start",
  },
  justify_end: {
    justifyContent: "flex-end",
  },
  justify_center: {
    justifyContent: "center",
  },
  justify_between: {
    justifyContent: "space-between",
  },
  justify_around: {
    justifyContent: "space-around",
  },

  items_start: {
    alignItems: "flex-start",
  },
  items_end: {
    alignItems: "flex-end",
  },
  items_center: {
    alignItems: "center",
  },
  items_baseline: {
    alignItems: "baseline",
  },
  items_stretch: {
    alignItems: "stretch",
  },
} as const;

export const ListCard: React.FC<ListProps> = ({
  name,
  products,
  onPress,
  onClickToDelete,
  onClickToEdit,
  onClickToShare,
  onClickToOptions,
  style,
  id,
}) => {
  const scale = useSharedValue(1);
  const height = useSharedValue(HEIGHT);
  const [expanded, setExpanded] = useState(false);

  const totalOfProducts = products?.length || 0;
  const bg = useThemeColor({}, "background.1");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
  }));

  const handleUncollapse = () => {
    setExpanded(false);
    height.value = HEIGHT;
  };
  const handleCollapse = () => {
    height.value = HEIGHT_EXPANDED;
    setExpanded(true);
  };

  let timeoutRef: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (expanded) {
      timeoutRef = setTimeout(() => {
        handleUncollapse();
      }, 3000);
    }

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef);
    };
  }, [expanded]);

  const listProducts = useMemo(() => {
    const productNames = products?.slice(0, 15).map((p) => p.name) || [];

    return productNames.join(", ");
  }, [products]);

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        {
          backgroundColor: bg,
          marginHorizontal: 4,
        },
        s.mb_sm,
        styles.container,
      ]}
      onPress={onPress}
      onLongPress={onClickToOptions}
      onPressIn={() => (scale.value = 0.98)}
      onPressOut={() => (scale.value = 1)}
    >
      <ThemedView
        bg="background.2"
        style={{
          borderRadius: 8,
          padding: 8,
          gap: 8,
        }}
      >
        <ThemedText style={styles.title}>{name}</ThemedText>
        <ThemedText
          type="body"
          colorName="text.5"
          style={{
            textTransform: "capitalize",
            fontSize: 10,
            lineHeight: 14,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {listProducts}
        </ThemedText>
      </ThemedView>

      <View
        style={{
          gap: 8,
        }}
      >
        <View
          style={[
            s.p_xs,
            s.radius_xs,
            s.flex_row,
            s.justify_between,
            s.items_center,
          ]}
        >
          <ThemedText type="body" colorName="text.5">
            {totalOfProducts} itens
          </ThemedText>
          <Pressable onPress={onClickToOptions}>
            <Icon name="more-vertical" size={16} />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    borderRadius: 8,
    padding: 4,
  },
  headerContainer: {
    gap: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 12,
  },
});
