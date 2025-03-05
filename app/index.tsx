import { List } from "@/components/List";
import { ListModal } from "@/components/ListModal";
import { Search } from "@/components/Search";
import { ThemedView } from "@/components/ThemedView";
import { List as ListType, useGetList } from "@/database/useShoppingList";
import { useKeyboard } from "@/hooks/useKeyboard";
import { Feather } from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  BackHandler,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
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
      <Stack.Screen
        options={{
          headerTitle: "Tsily",
          headerTitleStyle: { fontSize: 24, fontWeight: "bold" },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerRight: () => (
            <Pressable style={styles.avatar}>
              <Feather name="user" size={24} />
            </Pressable>
          ),
        }}
      />
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
      {/* {keyboardVisible && (
        <View style={styles.filters}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            data={["Todos", "Este mês", "Mês passado", "Outros"]}
            renderItem={({ item }) => (
              <Pressable style={styles.filter}>
                <Text style={styles.filterText}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      )} */}
      {!keyboardVisible && (
        <Pressable
          style={styles.createButton}
          accessibilityRole="button"
          onPress={() => {
            router.push(`/list`);
          }}
        >
          <Text style={styles.createButtonText}>Criar lista</Text>
        </Pressable>
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
    flexGrow: 1,
    paddingBottom: 48,
    paddingHorizontal: 16,
  },

  filters: {
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
    gap: 8,
    paddingHorizontal: 16,
  },
  filter: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgb(234, 234, 234)",
    borderWidth: 1,
    borderColor: "#DBDBDB",
    marginRight: 8,
  },
  filterText: {
    color: "rgb(78, 78, 78)",
    fontSize: 16,
  },

  avatar: {
    borderRadius: 24,
    height: 48,
    width: 48,
    justifyContent: "center",
    alignItems: "center",
  },

  createButton: {
    backgroundColor: "rgb(78, 78, 78)",
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginHorizontal: 16,
    position: "absolute",

    bottom: 16,
    alignSelf: "center",
    paddingHorizontal: 48,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
