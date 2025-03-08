import { List } from "@/components/List";
import { ListModal } from "@/components/ListModal";
import { Search } from "@/components/Search";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { List as ListType, useGetList } from "@/database/useShoppingList";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Stack, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, StatusBar, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const backgroundColorSheet = useThemeColor({}, "background.1");
  const iconColor = useThemeColor({}, "text.2");
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
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <ThemedView colorName="background" style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Minhas listas",
          headerShown: true,
          headerShadowVisible: false,
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

      {!keyboardVisible && (
        <View
          style={{
            padding: 16,
          }}
        >
          <Button
            onPress={() => {
              router.push("/list");
            }}
          >
            Criar lista
          </Button>
        </View>
      )}

      <ListModal
        opened={!!listSelected}
        onClose={() => {
          setListSelected(undefined);
        }}
      />

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: iconColor }}
        enablePanDownToClose
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: backgroundColorSheet }}
      >
        <BottomSheetScrollView style={{ flex: 1, padding: 16 }}>
          <ThemedText>Seus dados:</ThemedText>
          <ThemedView
            colorName="background.2"
            style={{ borderRadius: 16, marginTop: 8 }}
          >
            <View style={{ borderRadius: 16, overflow: "hidden" }}>
              <Pressable
                onPress={() => {}}
                android_ripple={{
                  color: "#E6E6E610",
                  foreground: true,
                }}
                style={{
                  flexDirection: "row",
                  padding: 16,
                  paddingHorizontal: 18,
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Icon name="trash" size={18} />
                <ThemedText type="defaultSemiBold">Apagar dados</ThemedText>
              </Pressable>
              <ThemedView
                colorName="background.3"
                style={{ height: 1, marginLeft: 50 }}
              />
              <Pressable
                onPress={() => {}}
                android_ripple={{
                  color: "#E6E6E610",
                  foreground: true,
                }}
                style={{
                  flexDirection: "row",
                  padding: 16,
                  paddingHorizontal: 18,
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Icon name="trash" size={18} />
                <ThemedText type="defaultSemiBold">Apagar dados</ThemedText>
              </Pressable>
            </View>
          </ThemedView>
          <ThemedText>Lista:</ThemedText>
          <ThemedText>user precos sugeridos:</ThemedText>
          <ThemedText>ver listas de produtos</ThemedText>
          <ThemedText>Sobre nós:</ThemedText>
          <ThemedText>Avaliações</ThemedText>
          <ThemedText>Enviar feedback</ThemedText>
        </BottomSheetScrollView>
      </BottomSheet>
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
