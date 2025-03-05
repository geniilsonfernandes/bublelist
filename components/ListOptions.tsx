import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Input } from "./ui/Input";

type ListOptionsProps = {
  onOpenSheet?: () => void;
};

export const ListOptions: React.FC<ListOptionsProps> = ({ onOpenSheet }) => {
  const trashIconColor = useThemeColor({}, "danger");
  const [modalVisible, setModalVisible] = useState(false);
  const iconColor = useThemeColor({}, "text.2");
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
      {/* <Pressable>
        <Feather name="user-plus" size={18} />
      </Pressable>
      <Pressable>
        <Feather name="share-2" size={18} />
      </Pressable> */}
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Feather name="edit" size={18} color={iconColor} />
      </Pressable>

      <Modal
        statusBarTranslucent={true}
        animationType="slide" // Tipo de animação, pode ser "fade" ou "slide"
        transparent={true} // Torna o fundo transparente
        visible={modalVisible} // Controla a visibilidade do Modal
        onRequestClose={() => setModalVisible(false)} // Fecha o Modal
        onShow={() => console.log("Modal foi mostrado!")}
        hardwareAccelerated={true}
      >
        <View style={styles.modalBackground}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              position: "absolute",
              backgroundColor: "transparent",
              height: "100%",
              width: "100%",
            }}
          ></TouchableOpacity>
          <View style={styles.modalContainer}>
            <Input placeholder="Nome da lista" iconName="repeat" />
            <Pressable style={[styles.option]}>
              <Feather name="trash" size={18} color={trashIconColor} />
              <ThemedText colorName="danger">Apagar</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    padding: 8,
    backgroundColor: "white",
    borderRadius: 24,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
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
});
