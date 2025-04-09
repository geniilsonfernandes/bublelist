import { ListCard } from "@/components/ListCard";
import { ListSheet } from "@/components/sheets/ListSheet";
import { SettingsSheet } from "@/components/sheets/SettingsSheet";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import BottomSheet from "@gorhom/bottom-sheet";
import MasonryList from "@react-native-seoul/masonry-list";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "expo-router";
import { ReactElement, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { List } from "@/database/useShoppingList";
import { db } from "@/lib/firebase";
import { useListStore } from "@/state/use-list-store";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

dayjs.locale("pt-br");

export function useSyncWithFirebase(lists: any) {
  const previousData = useRef<any>(null);

  const sync = useMemo(
    () =>
      debounce(async (lists: any) => {
        if (previousData.current && isEqual(previousData.current, lists)) {
          return;
        }

        const docRef = doc(db, "lists", "user_id");
        await setDoc(docRef, lists);

        previousData.current = lists;
      }, 10000),
    []
  );

  useEffect(() => {
    sync(lists);
  }, [lists, sync]);

  useEffect(() => {
    const docRef = doc(db, "lists", "user_id");

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        previousData.current = data;
        useListStore.setState({ lists: data });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
}

export default function HomeScreen() {
  const router = useRouter();

  const { lists, setActiveList } = useListStore();
  useSyncWithFirebase(lists);

  const settingsSheetRef = useRef<BottomSheet>(null);
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

  // useSyncLists(listsService, doc(db, "lists", "111"));

  const listsTransformed = useMemo(() => {
    return Object.values(lists);
  }, [lists]);

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
