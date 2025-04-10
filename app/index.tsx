import { ListCard } from "@/components/ListCard";
import { ListSheet } from "@/components/sheets/ListSheet";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import BottomSheet from "@gorhom/bottom-sheet";
import MasonryList from "@react-native-seoul/masonry-list";

import { Redirect, useRouter } from "expo-router";
import { ReactElement, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { useOnboardingStore } from "@/state/use-boarding-store";
import { List, useListStore } from "@/state/use-list-store";

export default function HomeScreen() {
  const { lists, setActiveList } = useListStore();
  const { hasSeenOnboarding } = useOnboardingStore();
  const router = useRouter();

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  const listSheetRef = useRef<BottomSheet>(null);

  const handleOpenListSheet = () => listSheetRef.current?.expand();

  const renderItem = ({ item }: { item: any }): ReactElement => (
    <ListCard
      {...item}
      onPress={() => {
        setActiveList(item.id);
        router.push(`/list/${item.id}`);
      }}
      onClickToOptions={() => {
        setActiveList(item.id);
        handleOpenListSheet();
      }}
    />
  );

  const listsTransformed = useMemo(() => {
    return Object.values(lists);
  }, [lists]);

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title.2" colorName="text.1">
          Minhas Listas
        </ThemedText>
        <View style={styles.actions}>
          <ActionButton onPress={() => router.push("/settings/geral")}>
            <Icon name="settings" size={24} colorName="text.2" />
          </ActionButton>
        </View>
      </View>

      <MasonryList
        data={listsTransformed || []}
        keyExtractor={(item: List) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        ListEmptyComponent={
          <View
            style={{
              padding: 16,
              gap: 8,
              alignItems: "center",
              paddingVertical: 56,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Icon name="clipboard" size={64} colorName="text.3" />

            <ThemedText
              type="title.3"
              style={{ textAlign: "center" }}
              colorName="text.4"
            >
              Você ainda não tem listas.
            </ThemedText>
            <ThemedText
              type="body"
              style={{ textAlign: "center" }}
              colorName="text.5"
            >
              Crie uma lista para começar a organizar suas compras.
            </ThemedText>
          </View>
        }
      />

      <ActionButton
        style={styles.floatingButton}
        onPress={() => router.push("/new-list")}
        bg="background.1"
        variant="solid"
      >
        <Icon name="plus" size={24} colorName="text.1" />
      </ActionButton>

      {/* Bottom Sheets */}

      <ListSheet
        ref={listSheetRef}
        onClose={() => listSheetRef.current?.close()}
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

    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flexDirection: "row",
  },
  dayText: {
    textTransform: "uppercase",
    fontWeight: "500",
    lineHeight: 54,
    fontSize: 34,
    fontFamily: "PlayfairDisplay-SemiBold",
  },
  dateText: {
    textTransform: "uppercase",
    fontWeight: "400",
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  list: {
    paddingBottom: 72,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
  },
});

/// criar switch
/// criar tela de onboaard
/// cria logica para tela de onboaard
