import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "../ui/Icon";
import { Paper } from "../ui/Paper";
import { ThemedText } from "../ui/ThemedText";
import { ThemedView } from "../ui/ThemedView";

type IconButtonWithLabelProps = {
  icon: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  label: string;
};
const IconButtonWithLabel: React.FC<IconButtonWithLabelProps> = ({
  icon = "trash-2",
  label,
  rightIcon = "chevron-right",
}) => {
  const backgroundColor = useThemeColor({}, "background.2");
  return (
    <View
      style={[{ borderRadius: 16, overflow: "hidden" }, { backgroundColor }]}
    >
      <Pressable
        onPress={() => {}}
        android_ripple={{
          color: "#E6E6E610",
          foreground: true,
        }}
        style={{
          flexDirection: "row",
          padding: 16,
          paddingHorizontal: 18,
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Icon name={icon} size={18} />
        <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>
          {label}
        </ThemedText>
        <Icon name={rightIcon} size={18} />
      </Pressable>
    </View>
  );
};



export const SettingsSheet = forwardRef<BottomSheet, {}>((props, ref) => {
  const backgroundColorSheet = useThemeColor({}, "background.1");
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
            <IconButtonWithLabel icon="upload" label="Exportar dados" />
            <ThemedView
              colorName="background.3"
              style={{ height: 1, marginLeft: 48 }}
            />
            <IconButtonWithLabel icon="trash-2" label="Apagar dados" />
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
});



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
