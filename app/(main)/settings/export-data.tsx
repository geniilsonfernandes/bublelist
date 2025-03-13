import { IconButtonWithLabel } from "@/components/ui/IconButtonWithLabel";
import { useGetList } from "@/database/useShoppingList";
import * as ExpoFileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { View } from "react-native";

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
    <View style={{ flex: 1, paddingHorizontal: 16, gap: 48, paddingTop: 16 }}>
      <IconButtonWithLabel
        onPress={exportJson}
        variant="solid"
        icon="upload"
        rightIcon="none"
        label="exportar dados (.json)"
      />
    </View>
  );
}
