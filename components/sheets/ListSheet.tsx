import { useDeleteList } from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useListStore } from "@/store/useListStore";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { forwardRef, useCallback, useMemo } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button } from "../ui/Button";
import { ThemedText } from "../ui/ThemedText";
import { ThemedView } from "../ui/ThemedView";

interface ListSheetProps {
  onClose: () => void;
}

export const ListSheet = forwardRef<BottomSheet, ListSheetProps>(
  ({ onClose }, ref) => {
    const { mutate: deleteList } = useDeleteList();
    const { list } = useListStore();
    const backgroundColor = useThemeColor({}, "background");
    const router = useRouter();

    const snapPoints = useMemo(() => ["25%"], []);

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

    const handleDeleteList = () => {
      Alert.alert(
        "Excluir lista",
        "Tem certeza que deseja excluir esta lista? Essa ação não poderá ser desfeita.",
        [
          {
            text: "Cancelar",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Excluir",
            onPress: () => {
              deleteList(list?.id);
            },
            style: "destructive",
          },
        ],
        { cancelable: true }
      );
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor, borderRadius: 8 }}
      >
        <BottomSheetView>
          <View style={styles.container}>
            <Button
              bg="background.1"
              leftIcon="clipboard"
              onPress={() => {
                onClose();
                router.push(`/(index)/list/${list?.id}/edit`);
              }}
            >
              <ThemedText>Editar esta lista</ThemedText>
            </Button>

            <ThemedView bg="background.1" style={styles.divider} />

            <Button
              bg="danger"
              leftIcon="trash-2"
              onPress={() => {
                onClose();
                handleDeleteList();
              }}
            >
              <ThemedText>Excluir esta lista</ThemedText>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});
