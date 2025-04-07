import { type List } from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ActionButton } from "./ui/ActionButton";
import { Icon } from "./ui/Icon";
import { ThemedText } from "./ui/ThemedText";

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

export const ListCard: React.FC<ListProps> = ({
  name,
  products,
  onPress,
  icon,
  color,
  onClickToDelete,
  onClickToEdit,
  onClickToShare,
  onClickToOptions,
  style,
}) => {
  const scale = useSharedValue(1);
  const height = useSharedValue(HEIGHT);
  const [expanded, setExpanded] = useState(false);

  const totalOfProducts = products.length || 0;
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

  return (
    <AnimatedPressable
      style={[
        animatedStyle,
        {
          backgroundColor: bg,
          marginBottom: 8,
          marginHorizontal: 4,
        },
        styles.container,
      ]}
      onPress={onPress}
      onLongPress={() => {
        console.log("long press");

        onClickToEdit && onClickToEdit();
      }}
      onPressIn={() => (scale.value = 0.98)}
      onPressOut={() => (scale.value = 1)}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>{name}</ThemedText>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",

            overflow: "hidden",
          }}
        >
          {products.map((product, i) => (
            <ThemedText
              key={product.id}
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
              {product.name}
              {i < products.length - 1 ? ", " : ""}
            </ThemedText>
          ))}
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 8,
        }}
      >
        <ThemedText type="body" colorName="text.5">
          {totalOfProducts} itens
        </ThemedText>

        <ActionButton onPress={onClickToOptions} style={styles.button}>
          <Icon name="more-vertical" size={18} />
        </ActionButton>
      </View>
      {/* <Text
          style={{
            textAlign: "center",
            lineHeight: 56,
            fontSize: 32,
            color: "#fff",
            paddingLeft: 8,
          }}
        >
          {icon || "📋"}
        </Text>
        <View>
          <ThemedText style={styles.title}>{name}</ThemedText>
          <ThemedText type="body" colorName="text.5">
            {totalOfProducts} itens
          </ThemedText>
        </View>
        <ActionButton onPress={onClickToOptions} style={styles.button}>
          <Icon name="more-vertical" size={18} />
        </ActionButton> */}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    justifyContent: "space-between",
    borderRadius: 8,
  },
  headerContainer: {
    gap: 8,
  },
  header: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quantity: {
    fontSize: 12,
  },
  button: {
    marginLeft: "auto",
  },
});
