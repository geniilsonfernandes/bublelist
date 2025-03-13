import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { IconButtonWithLabel } from "../ui/IconButtonWithLabel";
import { Paper } from "../ui/Paper";
import { ThemedText } from "../ui/ThemedText";
import { ThemedView } from "../ui/ThemedView";

type SettingsSheetProps = {
  onClose: () => void;
};

export const SettingsSheet = forwardRef<BottomSheet, SettingsSheetProps>(
  ({ onClose }, ref) => {
    const backgroundColorSheet = useThemeColor({}, "background.1");
    const router = useRouter();

    // variables
    const snapPoints = useMemo(() => ["25%", "54%"], []);

    // renders
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

    // settins
    // tema, oculta items marcados, mostra precoo, guarda preco,
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
        <BottomSheetScrollView>
          <View style={styles.container}>
            <ThemedText style={styles.sectionTitle}>Seus dados:</ThemedText>
            <Paper>
              <IconButtonWithLabel
                icon="upload"
                onPress={() => {
                  onClose();
                  router.push("/(main)/settings/export-data");
                }}
                label="Exportar dados"
              />
              <ThemedView
                colorName="background.3"
                style={{ height: 1, marginLeft: 48 }}
              />
              <IconButtonWithLabel
                onPress={() => {
                  onClose();
                  router.push("/(main)/settings/delete-data");
                }}
                icon="trash-2"
                label="Apagar dados"
              />
            </Paper>
            <ThemedText style={styles.sectionTitle}>Sobre nós:</ThemedText>

            <IconButtonWithLabel
              icon="star"
              label="Avalie a aplicação"
              rightIcon="external-link"
            />
            <Paper>
              <IconButtonWithLabel
                icon="message-circle"
                label="Conversar com desenvolvedor"
                rightIcon="external-link"
              />
              <ThemedView
                colorName="background.3"
                style={{ height: 1, marginLeft: 48 }}
              />
              <IconButtonWithLabel
                icon="file-text"
                label="Termos e condições"
                rightIcon="external-link"
              />
            </Paper>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: "500",
    marginTop: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
