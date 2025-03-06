import { useEditList } from "@/database/useShoppingList";
import { useBackHandler } from "@/hooks/useBackHandler";
import { useModals } from "@/store/useModals";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Header } from "../Header";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ValueInput } from "../ValueInput";
import { Modal } from "./Modal";

export const EditList = () => {
  const { mutate } = useEditList();
  const { selectedList, clearSelectedList } = useModals();

  const [listName, setListName] = useState(selectedList?.name || "");
  const [value, setValue] = useState(selectedList?.budget || null);

  useBackHandler({
    condition: !!selectedList,
    onBackPress: clearSelectedList,
  });

  const handleEditList = () => {
    if (!selectedList) return;
    mutate(
      {
        id: selectedList?.id,
        name: listName,
        budget: value || 0,
      },
      {
        onSuccess: () => {
          clearSelectedList();
        },
      }
    );
  };

  return (
    <Modal onClose={() => clearSelectedList()}>
      <Header
        title={selectedList?.name || "Nova lista"}
        subtitle={selectedList?.products.length + " produtos"}
      />
      <View style={styles.content}>
        <Input
          value={listName}
          onChangeText={setListName}
          showActions={false}
        />
        <ValueInput
          value={value}
          onChangeValue={(value) => setValue(value)}
          controlButtons
        />
      </View>
      <View style={styles.footer}>
        <Button
          variant="outline"
          style={{
            flex: 1,
          }}
          onPress={clearSelectedList}
        >
          Cancelar
        </Button>
        <Button
          variant="solid"
          style={{
            flex: 1,
          }}
          onPress={handleEditList}
        >
          Salvar
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 8,
    paddingTop: 16,
  },
  footer: {
    gap: 8,
    paddingTop: 16,
    flexDirection: "row",
  },
});
