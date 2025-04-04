import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Paper } from "../ui/Paper";
import { SettingsButton } from "../ui/SettingsButton";
import { ThemedText } from "../ui/ThemedText";

type SettingsSheetProps = {
  onClose: () => void;
};

export const SettingsSheet = forwardRef<BottomSheet, SettingsSheetProps>(
  ({ onClose }, ref) => {
    const backgroundColorSheet = useThemeColor({}, "background");
    const router = useRouter();

    // variables
    const snapPoints = useMemo(() => ["25%", "70%"], []);

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
          borderRadius: 8,
        }}
      >
        <BottomSheetScrollView>
          <View style={styles.container}>
            <ThemedText style={styles.sectionTitle}>Seus dados:</ThemedText>
            <Paper>
              <SettingsButton
                icon="upload"
                onPress={() => {
                  onClose();
                  router.push("/settings/export-data");
                }}
                label="Exportar dados"
                rightIcon="chevron-right"
              />

              <SettingsButton
                onPress={() => {
                  onClose();
                  router.push("/settings/delete-data");
                }}
                icon="trash-2"
                label="Apagar dados"
                rightIcon="chevron-right"
              />
            </Paper>

            <ThemedText style={styles.sectionTitle}>Lista:</ThemedText>
            <SettingsButton
              onPress={() => router.push("/settings/list")}
              icon="settings"
              rightIcon="chevron-right"
              label="Configurações da lista"
            />
            <ThemedText style={styles.sectionTitle}>Sobre nós:</ThemedText>

            <SettingsButton
              icon="star"
              label="Avalie a aplicação"
              rightIcon="external-link"
            />
            <Paper>
              <SettingsButton
                icon="message-circle"
                label="Conversar com desenvolvedor"
                rightIcon="external-link"
              />

              <SettingsButton
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
