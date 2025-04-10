import { SettingsButton } from "@/components/ui/SettingsButton";
import { ThemedView } from "@/components/ui/ThemedView";
import { useListStore } from "@/state/use-list-store";
import * as ExpoFileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export default function ExportData() {
  const { lists } = useListStore();

  const exportJson = async () => {
    if (!lists) return;

    const listsTransformed = Object.values(lists);

    const json = JSON.stringify(listsTransformed, null, 2);
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
