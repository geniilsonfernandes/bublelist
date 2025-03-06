import * as Haptics from "expo-haptics";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { Easing, FadeIn, FadeInUp } from "react-native-reanimated";
import { Chip } from "./Chip";

type SuggestionsProps = {
  onSelect: (item: string) => void;
  suggestions: string[];
};

export const Suggestions: React.FC<SuggestionsProps> = ({
  onSelect,
  suggestions,
}) => {
  const [mode, setMode] = useState<"horizontal" | "vertical">("horizontal");

  const handleSelect = (item: string) => {
    Haptics.selectionAsync();
    onSelect(item);
  };

  if (suggestions.length === 0) {
    return null;
  }

  // TODO: Add a button to switch between horizontal and vertical mode

  return (
    <View style={{ gap: 8 }}>
      {/* <Pressable
        
        style={({ pressed }) => [styles.button]}
      >
        <Feather
          name={mode !== "horizontal" ? "chevron-down" : "chevron-up"}
          size={16}
          color={iconColor}
        />
      </Pressable> */}
      {mode === "vertical" && (
        <ScrollView>
          <Animated.View
            entering={FadeInUp.duration(300).easing(Easing.inOut(Easing.quad))}
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {suggestions.map((item, index) => (
              <Animated.View
                key={item}
                entering={FadeIn.delay(index * 10)
                  .duration(300)
                  .easing(Easing.inOut(Easing.quad))}
              >
                <Chip label={item} />
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>
      )}
      {mode === "horizontal" && (
        <Animated.FlatList
          entering={FadeInUp.duration(300).easing(Easing.inOut(Easing.quad))}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item) => item}
          ItemSeparatorComponent={() => <View style={{ width: 4 }} />}
          data={suggestions}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeIn.delay(index * 10)
                .duration(300)
                .easing(Easing.inOut(Easing.quad))}
            >
              <TouchableOpacity onPress={() => handleSelect(item)}>
                <Chip label={item} />
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  button: {
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 16,
    height: 16,
    marginHorizontal: "auto",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
