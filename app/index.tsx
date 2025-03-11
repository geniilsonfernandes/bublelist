import { ListCard } from "@/components/ListCard";
import { Search } from "@/components/Search";
import { DeleteListSheet } from "@/components/sheets/DeleteListSheet";
import { SettingsSheet } from "@/components/sheets/SettingsSheet";
import { ShareListSheet } from "@/components/sheets/ShareListSheet";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { List, useGetList } from "@/database/useShoppingList";
import { useKeyboard } from "@/hooks/useKeyboard";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const keyboardVisible = useKeyboard();
  const [query, setQuery] = useState("");
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const router = useRouter();
  const { data } = useGetList();

  const filteredLists = useMemo(() => {
    return data?.filter((list) =>
      list.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  const sheetSettingsRef = useRef<BottomSheet>();
  const sheetDeleteListRef = useRef<BottomSheet>();
  const sheetShareListRef = useRef<BottomSheet>();

  console.log("HomeScreen");

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <ThemedText
            type="title"
            style={{
              marginVertical: 48,
              flex: 1,
            }}
          >
            listeiro +
          </ThemedText>
          <Icon
            name="settings"
            size={24}
            colorName="text.2"
            onPress={() => sheetSettingsRef.current?.snapToIndex(0)}
          />
        </View>
        <Search value={query} onChangeText={setQuery} />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredLists}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ListCard
            onPress={() => {
              router.push(`/(main)/lista/${item.id}`);
            }}
            onClickToDelete={() => {
              setSelectedList(item);
              sheetDeleteListRef.current?.snapToIndex(0);
            }}
            onClickToEdit={() => {
              router.push(`/(main)/lista/${item.id}/edit`);
            }}
            onClickToShare={() => {
              setSelectedList(item);
              sheetShareListRef.current?.snapToIndex(0);
            }}
            {...item}
          />
        )}
        keyExtractor={({ id }, index) => id}
      />
      <>
        {!keyboardVisible && (
          <View
            style={{
              padding: 16,
            }}
          >
            <Button
              onPress={() => {
                router.push("/(main)/lista/new");
              }}
            >
              Criar lista
            </Button>
          </View>
        )}
      </>
      <SettingsSheet ref={sheetSettingsRef as any} />
      <ShareListSheet
        list={selectedList}
        ref={sheetShareListRef as any}
        onClose={() => sheetShareListRef.current?.close()}
      />
      <DeleteListSheet
        list={selectedList}
        ref={sheetDeleteListRef as any}
        onClose={() => sheetDeleteListRef.current?.close()}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    marginTop: StatusBar.currentHeight,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 72,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    position: "absolute",
    width: "100%",
    padding: 16,
    paddingTop: 48,
    bottom: 0,
  },
});
