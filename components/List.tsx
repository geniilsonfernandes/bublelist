type ListProps = {
  title: string;
  quantity: number;
  onPress: () => void;
  onLongPress: () => void;
  list: LisType;
};
import { List as LisType } from "@/database/useShoppingList";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Progress } from "./Progress";
import { Icon } from "./ui/Icon";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const List: React.FC<ListProps> = ({
  title,
  quantity,
  onPress,
  onLongPress,
  list,
}) => {
  const scale = useSharedValue(1);
  const height = useSharedValue(80);
  const [expanded, setExpanded] = useState(false);
  const handlePressLong = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    onLongPress();
  };

  const itemsChecked = list.products.filter((item) => item.checked).length;
  const progress = Math.round((itemsChecked / quantity) * 100);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 200 }) }],
    height: withTiming(height.value, { duration: 100 }),
  }));

  const handleUncollapse = () => {
    setExpanded(false);
    height.value = 80;
  };

  let timeoutRef: NodeJS.Timeout | null = null; // Referência do timeout

  useEffect(() => {
    if (expanded) {
      timeoutRef = setTimeout(() => {
        handleUncollapse();
      }, 3000); // Fecha após 3 segundos
    }

    return () => {
      if (timeoutRef) clearTimeout(timeoutRef); // Limpa o timeout ao desmontar
    };
  }, [expanded]);

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPress={onPress}
      onLongPress={() => {
        height.value = 120;
        setExpanded(true);
      }}
      onPressIn={() => (scale.value = 0.98)}
      onPressOut={() => (scale.value = 1)}
    >
      <ThemedView backgroundColor="background.1" style={styles.container}>
        <View>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.quantity} colorName="text.3">
              {itemsChecked}/{list.products.length}
            </ThemedText>
          </ThemedView>
          <Progress progress={progress} />
        </View>
        {expanded ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Pressable style={styles.button} onPress={handleUncollapse}>
              <Icon name="edit" size={18} colorName="text.6" />
            </Pressable>
            <Pressable style={styles.button} onPress={handleUncollapse}>
              <Icon name="folder" size={18} colorName="text.6" />
            </Pressable>
            <Pressable style={styles.button} onPress={handleUncollapse}>
              <Icon name="trash" size={18} colorName="danger" />
            </Pressable>
            <Pressable
              style={[
                styles.button,
                {
                  marginLeft: "auto",
                },
              ]}
              onPress={handleUncollapse}
            >
              <Icon name="chevron-up" size={18} />
            </Pressable>
          </Animated.View>
        ) : null}
      </ThemedView>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 16,
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 16,
  },
  quantity: {
    fontSize: 12,
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
});
