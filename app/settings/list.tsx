import { CheckBox } from "@/components/ui/CheckBox";
import { Icon } from "@/components/ui/Icon";
import { SettingsButton } from "@/components/ui/SettingsButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useConfigStore } from "@/store/useConfigStore";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useRef } from "react";
import { Switch, View } from "react-native";

export default function SettingsList() {
  const backgroundColorSheet = useThemeColor({}, "background.1");
  const sheetRef = useRef<BottomSheetModal>(null);

  const {
    order_by,
    show_quantity,
    show_suggestions,
    show_value,
    show_total,
    setConfig,
  } = useConfigStore();

  const orderByOptions = [
    { label: "Alfabeticamente", value: "name" },
    { label: "Quantidade", value: "quantity" },
    { label: "Valor", value: "value" },
  ];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 49,
        }}
      />
    ),
    []
  );

  const renderSwitch = (value: boolean, onToggle: () => void) => (
    <Switch
      value={value}
      onValueChange={onToggle}
      thumbColor={value ? Colors.dark["primary.100"] : "#f4f3f4"}
    />
  );

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 16, gap: 8 }}>
      {/* Seção: Visualização */}
      <ThemedText type="defaultSemiBold" colorName="text.7">
        Visualização
      </ThemedText>

      <SettingsButton
        label="Mostrar a valor"
        rightComponent={renderSwitch(show_value, () =>
          setConfig("show_value", !show_value)
        )}
      />
      <SettingsButton
        label="Mostrar a quantidade"
        rightComponent={renderSwitch(show_quantity, () =>
          setConfig("show_quantity", !show_quantity)
        )}
      />

      <SettingsButton
        onPress={() => sheetRef.current?.present()}
        label={
          <ThemedText type="defaultSemiBold">
            Ordenar por:{" "}
            <ThemedText type="body" colorName="primary.200">
              {orderByOptions.find((o) => o.value === order_by)?.label}
            </ThemedText>
          </ThemedText>
        }
        rightComponent={
          <Icon name="chevron-down" size={18} colorName="text.5" />
        }
      />

      {/* Seção: Outros */}
      <ThemedText type="defaultSemiBold" colorName="text.7">
        Outros
      </ThemedText>

      <SettingsButton
        label="Mostrar o total da lista"
        rightComponent={renderSwitch(show_total, () =>
          setConfig("show_total", !show_total)
        )}
      />

      <SettingsButton
        label="Mostrar sugestões de produtos"
        rightComponent={renderSwitch(show_suggestions, () =>
          setConfig("show_suggestions", !show_suggestions)
        )}
      />

      {/* Bottom Sheet - Ordenação */}
      <BottomSheetModal
        ref={sheetRef}
        index={0}
        snapPoints={["35%"]}
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

          <View style={{ gap: 8 }}>
            {orderByOptions.map((option) => (
              <SettingsButton
                key={option.value}
                onPress={() => setConfig("order_by", option.value)}
                bg="background.2"
                label={option.label}
                rightComponent={
                  <CheckBox
                    value={order_by === option.value}
                    onChange={(checked) => {
                      if (checked) setConfig("order_by", option.value);
                    }}
                  />
                }
              />
            ))}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </ThemedView>
  );
}
