import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type ListModalProps = {
  opened: boolean;
  onClose: () => void;
};

export const ListModal: React.FC<ListModalProps> = ({ opened, onClose }) => {
  const trashIconColor = useThemeColor({}, "danger");
  const optionIconColor = useThemeColor({}, "text.4");

  const handleClose = () => {
    Haptics.selectionAsync();
    onClose();
  }
  return (
    <Modal
      visible={opened}
      onRequestClose={handleClose}
      transparent
      animationType="slide"
      statusBarTranslucent={true}
    >
      <View style={styles.modal}>
        <ThemedView colorName="background" style={styles.content}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitle}>
              <ThemedView
                colorName="background.1"
                style={{
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Feather
                  name="shopping-bag"
                  size={18}
                  color={optionIconColor}
                />
              </ThemedView>
              <ThemedText>lita 1</ThemedText>
            </View>
            <Pressable onPress={handleClose}>
              <ThemedView colorName="background.1" style={styles.closeButton}>
                <Feather name="x" size={18} color={optionIconColor} />
              </ThemedView>
            </Pressable>
          </View>
          <Pressable
            onPress={onClose}
            style={[styles.option, styles.capBorderBottom]}
          >
            <Feather name="arrow-up-right" size={18} color={optionIconColor} />
            <ThemedText colorName="text.5">Abrir lista</ThemedText>
          </Pressable>
          <Pressable
            onPress={onClose}
            style={[styles.option, styles.capBorderBottom, styles.capBorderTop]}
          >
            <Feather name="archive" size={18} color={optionIconColor} />
            <ThemedText colorName="text.5">Arquivar</ThemedText>
          </Pressable>

          <Pressable
            onPress={onClose}
            style={[styles.option, styles.capBorderTop, styles.capBorderBottom]}
          >
            <Feather name="share-2" size={18} color={optionIconColor} />
            <ThemedText colorName="text.5">Compartilhar</ThemedText>
          </Pressable>
          <ThemedView style={styles.divider} backgroundColor="background.1" />
          <Pressable
            onPress={onClose}
            style={[styles.option, styles.capBorderTop]}
          >
            <Feather name="trash" size={18} color={trashIconColor} />
            <ThemedText colorName="danger">Apagar</ThemedText>
          </Pressable>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.14)",
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },

  content: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#DBDBDB",
    gap: 8,
    width: 300,

    justifyContent: "space-between",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
    marginVertical: 2,
  },
  modalTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  closeButton: {
    padding: 8,
    borderRadius: 8,
    borderTopEndRadius: 16,
  },

  option: {
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgb(243, 243, 243)",
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    gap: 12,
  },

  divider: {
    height: 1,

    marginHorizontal: 24,
  },

  capBorderTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  capBorderBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
