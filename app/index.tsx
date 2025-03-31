import BottomSheet from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { ListCard } from "@/components/ListCard";
import { ListSheet } from "@/components/sheets/ListSheet";
import { SettingsSheet } from "@/components/sheets/SettingsSheet";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { useGetList } from "@/database/useShoppingList";
import { useListStore } from "@/store/useListStore";
import { StatusBar } from "react-native";

dayjs.locale("pt-br");

export default function HomeScreen() {
  const router = useRouter();
  const { setList } = useListStore();
  const { data } = useGetList();

  const settingsSheetRef = useRef<BottomSheet>(null);
  const listSheet = useRef<BottomSheet>(null);

  const handleOpenSettings = () => settingsSheetRef.current?.snapToIndex(0);

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
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
        </View>

        {/* <View style={styles.actions}>
          <ActionButton onPress={handleOpenSettings}>
            <Icon name="settings" size={24} colorName="text.2" />
          </ActionButton>
        </View> */}
      </View>

      <SectionTitle title="Minhas listas" />

      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ListCard
            {...item}
            onPress={() => {
              setList(item);
              router.push(`/(list)/show/${item.id}`);
            }}
            onClickToEdit={() => {
              setList(item);
              listSheet.current?.expand();
            }}
            // onClickToEdit={() => router.push(`/list/${item.id}/edit`)}
          />
        )}
      />

      <ActionButton
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 56,
          height: 56,
        }}
        onPress={() => router.push(`/(list)/new`)}
        bg="primary.100"
        variant="solid"
      >
        <Icon name="plus" size={24} colorName="text.1" />
      </ActionButton>

      {/* Bottom Sheets */}
      <SettingsSheet
        ref={settingsSheetRef}
        onClose={() => settingsSheetRef.current?.close()}
      />
      <ListSheet ref={listSheet} onClose={() => listSheet.current?.close()} />
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
