import { List, useDeleteList } from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Header } from "../Header";

type DetailsListSheetProps = {
  onClose?: () => void;
  list: List | null;
};

export const SettingsListSheet = forwardRef<BottomSheet, DetailsListSheetProps>(
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
        
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);
