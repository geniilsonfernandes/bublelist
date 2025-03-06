import { List } from "@/components/List";
import { ListModal } from "@/components/ListModal";
import { Search } from "@/components/Search";
import { Button } from "@/components/ui/Button";
import { ThemedView } from "@/components/ui/ThemedView";
import { List as ListType, useGetList } from "@/database/useShoppingList";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { BackHandler, FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const keyboardVisible = useKeyboard();
  const [listSelected, setListSelected] = useState<ListType>();
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data } = useGetList();

  const filteredLists = useMemo(() => {
    return data?.filter((list) =>
      list.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);

  useFocusEffect(() => {
    // disable back button only on home screen
    const backButtonHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        BackHandler.exitApp();
        return true;
      }
    );
    return () => backButtonHandler.remove();
  });

  //TODO: IMPLEMENTAR O FILTRO POR LABEL

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View style={styles.header}>
        <Search value={query} onChangeText={setQuery} />
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={filteredLists}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <List
            title={item.name}
            list={item}
            quantity={item.products.length}
            onPress={() => {
              router.push(`/list/${item.id}`);
            }}
            onLongPress={() => {
              setListSelected(item);
            }}
          />
        )}
        keyExtractor={({ id }, index) => id}
      />

      {!keyboardVisible && (
        <LinearGradient
          colors={["transparent", backgroundColor]}
          style={[styles.buttonContainer]}
        >
          <Button
            onPress={() => {
              router.push(`/list`);
            }}
          >
            Criar lista
          </Button>
        </LinearGradient>
      )}

      <ListModal
        opened={!!listSelected}
        onClose={() => {
          setListSelected(undefined);
        }}
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
    marginTop: 48,
    marginBottom: 16,
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
