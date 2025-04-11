import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { CheckBox } from "@/components/ui/CheckBox";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsButton } from "@/components/ui/SettingsButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useConfigStore } from "@/state/use-config-store";

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Linking, View } from "react-native";

const APP_LINK =
  "https://play.google.com/store/apps/details?id=com.orriker.Bubblylist";
export default function Settings() {
  const router = useRouter();
  const backgroundColorSheet = useThemeColor({}, "background");
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
    <View>
      <CheckBox value={value} onChange={onToggle} />
    </View>
  );

  return (
    <BodyScrollView
      style={{
        padding: 16,
        backgroundColor: backgroundColorSheet,
      }}
    >
      {/* Seção: Visualização */}
      <SectionTitle title="Visualização:" />
      <View style={{ gap: 8, paddingVertical: 16 }}>
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
              <ThemedText type="body" colorName="text.6">
                {orderByOptions.find((o) => o.value === order_by)?.label}
              </ThemedText>
            </ThemedText>
          }
          rightComponent={
            <Icon name="chevron-down" size={18} colorName="text.5" />
          }
        />

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
      </View>

      <View style={{ gap: 8, paddingVertical: 16 }}>
        <SectionTitle title="Seus dados:" />
        <SettingsButton
          icon="upload"
          onPress={() => {
            router.push("/settings/export-data");
          }}
          label="Exportar dados"
          rightIcon="chevron-right"
        />

        <SettingsButton
          onPress={() => {
            router.push("/settings/delete-data");
          }}
          icon="trash-2"
          label="Apagar dados"
          rightIcon="chevron-right"
        />
      </View>

      <View style={{ gap: 8, paddingVertical: 16, paddingBottom: 100 }}>
        <SectionTitle title="Informações do app:" />
        <SettingsButton
          onPress={() => {
            router.push("/settings/privacy-policy");
          }}
          icon="info"
          label="Politica de privacidade"
          rightIcon="chevron-right"
        />

        <SettingsButton
          onPress={() => {
            router.push("/settings/feedback");
          }}
          icon="github"
          label="Conversar com o desenvolvedor"
          rightIcon="chevron-right"
        />
        <SettingsButton
          onPress={() => {
            Linking.openURL(APP_LINK);
          }}
          icon="star"
          label="Avaliar o app"
          rightIcon="external-link"
        />
      </View>

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
    </BodyScrollView>
  );
}
