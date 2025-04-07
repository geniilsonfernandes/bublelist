import BottomSheet from "@gorhom/bottom-sheet";
import MasonryList from "@react-native-seoul/masonry-list";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "expo-router";
import { ReactElement, useRef } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

import { ListCard } from "@/components/ListCard";
import { ListSheet } from "@/components/sheets/ListSheet";
import { SettingsSheet } from "@/components/sheets/SettingsSheet";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { List, useGetList } from "@/database/useShoppingList";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useListStore } from "@/store/useListStore";
import { Redirect } from "expo-router";

dayjs.locale("pt-br");

export default function HomeScreen() {
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);

  const router = useRouter();
  const { setList } = useListStore();
  const { data } = useGetList();

  const settingsSheetRef = useRef<BottomSheet>(null);
  const listSheetRef = useRef<BottomSheet>(null);

  const handleOpenSettings = () => settingsSheetRef.current?.snapToIndex(0);

  const handleOpenListSheet = () => listSheetRef.current?.expand();

  const renderItem = ({ item }: { item: any }): ReactElement => (
    <ListCard
      {...item}
      onPress={() => {
        setList(item);
        router.push(`/(list)/show/${item.id}`);
      }}
      onClickToOptions={() => {
        setList(item);
        handleOpenListSheet();
      }}
    />
  );

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <ThemedText type="title.3" style={styles.dayText} colorName="text.1">
            {dayjs().format("ddd")}.
            <ThemedText type="body" style={styles.dateText} colorName="text.6">
              {" "}
              {dayjs().format("DD")}
            </ThemedText>
          </ThemedText>
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
        onPress={() => router.push(`/(list)/new`)}
        bg="background.1"
        variant="solid"
      >
        <Icon name="plus" size={24} colorName="text.1" />
      </ActionButton>

      {/* Bottom Sheets */}
      <SettingsSheet
        ref={settingsSheetRef}
        onClose={() => settingsSheetRef.current?.close()}
      />

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
    marginTop: StatusBar.currentHeight,
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
