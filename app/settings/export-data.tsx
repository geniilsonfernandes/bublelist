import { SettingsButton } from "@/components/ui/SettingsButton";
import { ThemedView } from "@/components/ui/ThemedView";
import { useGetList } from "@/database/useShoppingList";
import * as ExpoFileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function ExportData() {
  const { data } = useGetList();

  const exportJson = async () => {
    if (!data) return;
    const json = JSON.stringify(data, null, 2);
    const fileUri = `${ExpoFileSystem.cacheDirectory}shopping_list.json`;
    await ExpoFileSystem.writeAsStringAsync(fileUri, json, {
      encoding: ExpoFileSystem.EncodingType.UTF8,
    });
    await Sharing.shareAsync(fileUri);
  };

  return (
    <ThemedView
      style={{ flex: 1, paddingHorizontal: 16, gap: 48, paddingTop: 16 }}
    >
      <SettingsButton
        onPress={exportJson}
        icon="upload"
        label="exportar dados (.json)"
      />
    </ThemedView>
  );
}
