import { List } from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Share, View } from "react-native";
import { Header } from "../Header";
import { Button } from "../ui/Button";

type ShareListSheetProps = {
  onClose?: () => void;
  list: List | null;
};

export const ShareListSheet = forwardRef<BottomSheet, ShareListSheetProps>(
  ({ onClose, list }, ref) => {
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

    const formatListForSharing = (list: List): string => {
      return (
        `Lista: ${list.name}\n` +
        (list.budget ? `Orçamento: R$ ${list.budget.toFixed(2)}\n` : "") +
        "\nProdutos:\n" +
        list.products
          .map(
            (product, index) =>
              `${index + 1}. ${product.name} - ${
                product.quantity
              }x R$ ${product.value.toFixed(2)} ${
                product.checked ? "(✔️)" : "(❌)"
              }`
          )
          .join("\n")
      );
    };

    const shareList = async () => {
      if (!list) return;
      try {
        const message = formatListForSharing(list);
        await Share.share({ message });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: backgroundColorSheet,
          borderRadius: 24,
        }}
      >
        <BottomSheetScrollView style={{ paddingHorizontal: 16 }}>
          <Header
            title="Compartilhar lista"
            subtitle="Selecione o tipo de compartilhamento"
          />
          <View style={{ gap: 8, paddingTop: 48 }}>
            <Button variant="solid" onPress={shareList}>
              Compartilhar Lista
            </Button>
            <Button onPress={onClose} variant="outline" cap="top">
              Cancelar
            </Button>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);
