import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Switch,
  View,
  ViewStyle,
} from "react-native";

type SettingsButtonProps = {
  label: string | React.ReactNode;
  rightComponent?: React.ReactNode;
  pr?: number;
  onPress?: () => void;
};

const SettingsButton: React.FC<SettingsButtonProps> = ({
  label,
  rightComponent,
  pr,
  onPress,
}) => {
  const backgroundColor = useThemeColor({}, "background.1");
  const styles: StyleProp<ViewStyle> = {
    paddingRight: pr,
  };

  const Comp = onPress ? Pressable : View;
  return (
    <Comp
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: 16,
          height: 56,
          borderRadius: 8,
          backgroundColor,
        },
        styles,
      ]}
      onPress={onPress}
      // bg="background.1"
    >
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      {rightComponent}
    </Comp>
  );
};

export default function SettingsList() {
  const backgroundColorSheet = useThemeColor({}, "background.1");
  const sheet = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["30%"], []);
  const [settings, setSettings] = useState({
    showQuantity: true,
    showTotal: true,
    showSuggestions: false,
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 49 }}
      />
    ),
    []
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, gap: 8 }}>
      <ThemedText type="defaultSemiBold" colorName="text.7">
        Visualização
      </ThemedText>

      <SettingsButton
        label="Mostrar a quantidade e o valor"
        rightComponent={
          <Switch
            thumbColor={
              settings.showQuantity ? Colors.dark["primary.100"] : "#f4f3f4"
            }
            value={settings.showQuantity}
            onChange={() =>
              setSettings({ ...settings, showQuantity: !settings.showQuantity })
            }
            style={styles.switch}
          />
        }
      />
      <SettingsButton
        onPress={() => {
          sheet.current?.present();
        }}
        label={
          <ThemedText type="defaultSemiBold">
            Ordenar por:{" "}
            <ThemedText type="body" colorName="primary.200">
              {settings.showQuantity ? "Quantidade" : "Valor"}
            </ThemedText>
          </ThemedText>
        }
        rightComponent={
          <Icon name="chevron-down" size={18} colorName="text.5" />
        }
      />

      <ThemedText type="defaultSemiBold" colorName="text.7">
        Outros
      </ThemedText>
      <SettingsButton
        label="Mostrar o total da lista"
        rightComponent={
          <Switch
            thumbColor={
              settings.showTotal ? Colors.dark["primary.100"] : "#f4f3f4"
            }
            value={settings.showTotal}
            onChange={() =>
              setSettings({ ...settings, showTotal: !settings.showTotal })
            }
            style={styles.switch}
          />
        }
      />
      <SettingsButton
        label="Mostrar sugestoes de produtos"
        rightComponent={
          <Switch
            thumbColor={
              settings.showSuggestions ? Colors.dark["primary.100"] : "#f4f3f4"
            }
            value={settings.showSuggestions}
            onChange={() =>
              setSettings({
                ...settings,
                showSuggestions: !settings.showSuggestions,
              })
            }
            style={styles.switch}
          />
        }
      />
      <BottomSheetModal
        ref={sheet}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: backgroundColorSheet,
          borderRadius: 8,
        }}
      >
        <BottomSheetScrollView style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingBottom: 16,
            }}
          >
            <ThemedText type="defaultSemiBold">Ordenar por</ThemedText>
          </View>
          <ThemedView
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: 16,
              height: 56,
              borderRadius: 8,
            }}
            backgroundColor="background.2"
          >
            <ThemedText type="defaultSemiBold">Quantidade</ThemedText>
            <ThemedView
              borderColor="background.5"
              bg="background.2"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="check" size={18} colorName="text.5" />
            </ThemedView>
          </ThemedView>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: { height: 1 },
  switch: { marginRight: -8 },
});
