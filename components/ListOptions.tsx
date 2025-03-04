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

type ListOptionsProps = {
  onOpenSheet?: () => void;
};

export const ListOptions: React.FC<ListOptionsProps> = ({ onOpenSheet }) => {
  const [modalVisible, setModalVisible] = useState(false);

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
        <Feather name="trash" size={18} color="#F96868" />
      </Pressable>

      <Modal
        statusBarTranslucent={true}
        animationType="fade" // Tipo de animação, pode ser "fade" ou "slide"
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
            <ThemedText>Tem certeza que deseja excluir essa lista?</ThemedText>
            <View style={styles.modalFooter}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                <ThemedText colorName="text.2">Cancelar</ThemedText>
              </Pressable>
              <Pressable style={styles.modalButton}>
                <ThemedText colorName="danger">Excluir</ThemedText>
              </Pressable>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 16,
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
});
