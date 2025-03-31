import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Chip } from "./Chip";

type SuggestionsProps = {
  onSelect: (item: string) => void;
  suggestions: string[];
};

export const Suggestions: React.FC<SuggestionsProps> = ({ onSelect, suggestions }) => {
  const [mode, setMode] = useState<"horizontal" | "vertical">("horizontal");

  const handleSelect = (item: string) => {
    Haptics.selectionAsync();
    onSelect(item);
  };

  if (suggestions.length === 0) {
    return null;
  }

  const memoList = useMemo(() => suggestions, [suggestions]);
  // TODO: Add a button to switch between horizontal and vertical mode

  return (
    <>
      {mode === "horizontal" && (
        <FlatList
          key={memoList.length}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            gap: 8,
          }}
          // layout={LinearTransition}
          keyExtractor={(item) => item}
          data={memoList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)}>
              <Chip label={item} />
            </TouchableOpacity>
          )}
        />
      )}
    </>
  );
};
