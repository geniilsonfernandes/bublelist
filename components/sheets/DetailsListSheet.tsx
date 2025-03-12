import { List, useDeleteList } from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { View } from "react-native";
import { Header } from "../Header";
import { Button } from "../ui/Button";

type DetailsListSheetProps = {
  onClose?: () => void;
  list: List | null;
};

export const DetailsListSheet = forwardRef<BottomSheet, DetailsListSheetProps>(
  ({ onClose, list }, ref) => {
    const { mutate: deleteList, isPending } = useDeleteList();
    const backgroundColorSheet = useThemeColor({}, "background.1");

    const snapPoints = useMemo(() => ["30%"], []);

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

    const handleDelete = () => {
      if (!list) {
        return;
      }
      deleteList(list.id, {
        onSuccess: () => {
          onClose?.();
        },
      });
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        // onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: backgroundColorSheet,
          borderRadius: 24,
        }}
      >
        <BottomSheetScrollView style={{ paddingHorizontal: 16 }}>
          <Header title={list?.name || ""} />
          <View style={{ gap: 8, paddingTop: 48 }}>
            <Button
              variant="danger"
              isLoading={isPending}
              onPress={handleDelete}
            >
              Deletar lista
            </Button>
            <Button
              onPress={() => {
                onClose?.();
              }}
              variant="outline"
              cap="top"
            >
              Cancelar
            </Button>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);
