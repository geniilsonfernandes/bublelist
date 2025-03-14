import { type List } from "@/database/useShoppingList";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Progress } from "./Progress";
import { ActionButton } from "./ui/ActionButton";
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
} & List;

const HEIGHT = 80;
const HEIGHT_EXPANDED = 138;

export const ListCard: React.FC<ListProps> = ({
  name,
  products,
  onPress,
  onClickToDelete,
  onClickToEdit,
  onClickToShare,
  onClickToOptions,
}) => {
  const scale = useSharedValue(1);
  const height = useSharedValue(HEIGHT);
  const [expanded, setExpanded] = useState(false);

  const totalOfProducts = products.length || 0;
  const itemsChecked = products.filter((item) => item.checked).length;
  const progress = Math.round((itemsChecked / totalOfProducts) * 100);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
    height: withTiming(height.value, { duration: 100 }),
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
      style={animatedStyle}
      onPress={onPress}
      onLongPress={() => {
        height.value = HEIGHT_EXPANDED;
        setExpanded(true);
      }}
      onPressIn={() => (scale.value = 0.98)}
      onPressOut={() => (scale.value = 1)}
    >
      <ThemedView backgroundColor="background.1" style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>{name}</ThemedText>

            <ActionButton size="sm" variant="ghost" onPress={handleCollapse}>
              <Icon name="more-vertical" size={18} />
            </ActionButton>
          </View>
          <Progress progress={progress} />
        </View>
        {expanded ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <ActionButton onPress={onClickToEdit}>
              <Icon name="edit" size={18} colorName="text.6" />
            </ActionButton>
            <ActionButton onPress={onClickToShare}>
              <Icon name="share-2" size={18} colorName="text.6" />
            </ActionButton>
            <ActionButton onPress={onClickToDelete}>
              <Icon name="trash" size={18} colorName="danger" />
            </ActionButton>
          </Animated.View>
        ) : null}
      </ThemedView>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    width: "100%",
    height: HEIGHT,
    flex: 1,
    justifyContent: "space-between",
  },
  headerContainer: {
    gap: 8,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 12,
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
});
