import BottomSheet from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { ListCard } from "@/components/ListCard";
import { DeleteListSheet } from "@/components/sheets/DeleteListSheet";
import { SettingsSheet } from "@/components/sheets/SettingsSheet";
import { ShareListSheet } from "@/components/sheets/ShareListSheet";
import { ActionButton } from "@/components/ui/ActionButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { Input } from "@/components/ui/Input";
import { List, useGetList } from "@/database/useShoppingList";
import { useKeyboard } from "@/hooks/useKeyboard";
import { StatusBar } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";

dayjs.locale("pt-br");

export default function HomeScreen() {
  const router = useRouter();
  const keyboardVisible = useKeyboard();
  const { data } = useGetList();
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  const settingsSheetRef = useRef<BottomSheet>(null);
  const deleteSheetRef = useRef<BottomSheet>(null);
  const shareSheetRef = useRef<BottomSheet>(null);

  const handleOpenSettings = () => settingsSheetRef.current?.snapToIndex(0);
  const handleOpenDelete = (list: List) => {
    setSelectedList(list);
    deleteSheetRef.current?.snapToIndex(0);
  };
  const handleOpenShare = (list: List) => {
    setSelectedList(list);
    shareSheetRef.current?.snapToIndex(0);
  };

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View style={styles.header}>
        {showSearch ? (
          <Animated.View
            entering={FadeInDown.duration(200).easing(
              Easing.inOut(Easing.quad)
            )}
            exiting={FadeOutDown.duration(200).easing(
              Easing.inOut(Easing.quad)
            )}
            style={styles.search}
          >
            <ActionButton onPress={() => setShowSearch(false)}>
              <Icon name="arrow-left" size={24} colorName="text.2" />
            </ActionButton>
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder="Procurar Lista"
              bg="background.1"
              showActions={false}
              fullWidth
              size="xl"
            />
          </Animated.View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(200).easing(Easing.inOut(Easing.quad))}
            exiting={FadeOut.duration(200).easing(Easing.inOut(Easing.quad))}
            style={styles.title}
          >
            <View>
              <ThemedText
                type="title.2"
                style={styles.uppercase}
                colorName="text.1"
              >
                {dayjs().format("ddd[.] M")}
              </ThemedText>
              <ThemedText type="body" colorName="text.5">
                {dayjs().format("YYYY")}
              </ThemedText>
            </View>
            <ActionButton onPress={() => setShowSearch(!showSearch)}>
              <Icon name="search" size={24} colorName="text.2" />
            </ActionButton>
          </Animated.View>
        )}

        <View style={styles.actions}>
          <ActionButton onPress={handleOpenSettings}>
            <Icon name="settings" size={24} colorName="text.2" />
          </ActionButton>
        </View>
      </View>

      <SectionTitle title="Fixas" />
      <SectionTitle title="Minhas listas" />

      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => (
          <ListCard
            {...item}
            onPress={() => router.push(`/(list)/show/${item.id}`)}
            // onClickToEdit={() => router.push(`/list/${item.id}/edit`)}
            onClickToDelete={() => handleOpenDelete(item)}
            onClickToShare={() => handleOpenShare(item)}
          />
        )}
      />

      {!keyboardVisible && (
        <View style={styles.buttonContainer}>
          <Button onPress={() => router.push("/(list)/new")}>
            Criar lista
          </Button>
        </View>
      )}

      {/* Bottom Sheets */}
      <SettingsSheet
        ref={settingsSheetRef}
        onClose={() => settingsSheetRef.current?.close()}
      />
      <ShareListSheet
        ref={shareSheetRef}
        list={selectedList}
        onClose={() => shareSheetRef.current?.close()}
      />
      <DeleteListSheet
        ref={deleteSheetRef}
        list={selectedList}
        onClose={() => deleteSheetRef.current?.close()}
      />
    </ThemedView>
  );
}

// Componentização simples para os títulos de seção
function SectionTitle({ title }: { title: string }) {
  return (
    <View style={styles.sectionTitle}>
      <ThemedText type="defaultSemiBold" colorName="text.5">
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    marginTop: StatusBar.currentHeight,
    paddingVertical: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  search: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  uppercase: {
    textTransform: "uppercase",
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 72,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    padding: 16,
  },
});
