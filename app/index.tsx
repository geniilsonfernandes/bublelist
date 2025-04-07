import BottomSheet from "@gorhom/bottom-sheet";
import MasonryList from "@react-native-seoul/masonry-list";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "expo-router";
import { ReactElement, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { ListSheet } from "@/components/sheets/ListSheet";
import { SettingsSheet } from "@/components/sheets/SettingsSheet";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { ListCard } from "@/components/ListCard";
import { List, useGetList } from "@/database/useShoppingList";
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

  const renderItem = ({ item, i }: { item: any; i: number }): ReactElement => {
    return (
      <ListCard
        {...item}
        onPress={() => {
          setList(item);
          router.push(`/(list)/show/${item.id}`);
        }}
        onClickToOptions={() => {
          setList(item);
          listSheet.current?.expand();
        }}
      />
    );
  };

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
              {dayjs().format("ddd[.] DD")}
            </ThemedText>
            <ThemedText type="body" colorName="text.5">
              {dayjs().format("MMMM YYYY")}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actions}>
          <ActionButton onPress={handleOpenSettings}>
            <Icon name="settings" size={24} colorName="text.2" />
          </ActionButton>
        </View>
      </View>

      <MasonryList
        data={data || []}
        keyExtractor={(item: List) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />

      {/* <FlatList
        columnWrapperStyle={{ justifyContent: "space-between", gap: 8 }}
        contentContainerStyle={styles.list}
        data={data}
        keyExtractor={(item) => item.id}
        horizontal={false}
        numColumns={2}
        renderItem={({ item }) => (
          <ListCard
            {...item}
            onPress={() => {
              setList(item);
              router.push(`/(list)/show/${item.id}`);
            }}
            onClickToOptions={() => {
              setList(item);
              listSheet.current?.expand();
            }}
          />
        )}
      /> */}
      {/* 
      <FlatList
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <SectionTitle style={styles.sectionTitle} title="Minhas listas" />
        )}
        data={data}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <EmptyList
            message="Nenhuma lista criada"
            subMessage="Crie uma nova lista para começar"
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <ListCard
            {...item}
            onPress={() => {
              setList(item);
              router.push(`/(list)/show/${item.id}`);
            }}
            onClickToOptions={() => {
              setList(item);
              listSheet.current?.expand();
            }}
          />
        )}
      /> */}

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
    marginBottom: 16,
  },
  list: {
    paddingBottom: 72,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    padding: 16,
  },
});
