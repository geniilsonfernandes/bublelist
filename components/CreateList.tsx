import { useCreateListAnimation } from "@/hooks/animations/useCreateListAnimation";
import { useShakeAnimation } from "@/hooks/animations/useShakeAnimation";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Input } from "./ui/Input";

const listNameSugestion = [
  "Feira da Semana",
  `Lista de ${dayjs().locale("pt-br").format("MMMM")}`,
  `${dayjs().format("DD/MM/YYYY")}`,
  "Compras Mensais",
  "Itens de Padaria",
  "Carnes e Frios",
  "Produtos de Limpeza",
  "Farmácia",
  "Lanches e Snacks",
  "Café da Manhã",
  "Churrasco",
  "Jantar Especial",
];

// TODO: MUDAR A LOGICA PARA UM HOOK
// TODO: MUDAR A LOGICA DAS ANIAMCOES PARA UM HOOK
// TODO: usar o falsh list

const useCreateList = () => {};

type CreateListProps = {
  opened: boolean;
  onClose: () => void;
};

export const CreateList: React.FC<CreateListProps> = ({ onClose, opened }) => {
  const { startShake, animatedStyle: animatedShake } = useShakeAnimation();
  const {
    animatedSheetStyle: animatedSheet,
    toggleOpen: toggleSheet,
    opened: isSheetOpened,
  } = useCreateListAnimation();
  const [showMore, { toggle: toggleShowMore, close: closeShowMore }] =
    useDisclosure();
  const [listName, setListName] = useState("");
  const [listBudget, setListBudget] = useState("");
  const [isError, setIsError] = useState(false);

  const setListNameSugestion = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setListName(name);
  };

  const handleCloseSheet = () => {
    closeShowMore();
    toggleSheet();
  };

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setListBudget(String(Number(listBudget) + 50));
  };

  const handleDecrement = () => {
    if (Number(listBudget) > 0) {
      setListBudget(String(Number(listBudget) - 50));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const handleGetRandomName = () => {
    const randomIndex = Math.floor(Math.random() * listNameSugestion.length);
    const randomName = listNameSugestion[randomIndex];
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setListName(randomName);
  };

  const handleCreateList = () => {
    onClose();
    if (!listName) {
      startShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setIsError(true);
      return;
    }
    if (listName && listBudget) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // TODO: MUDAR A LOGICA PARA UM HOOK
      // TODO: MUDAR A LOGICA DAS ANIAMCOES PARA UM HOOK
      // TODO: usar o falsh list
      // TODO: usar o falsh list
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClose();
  };
  const optionIconColor = useThemeColor({}, "text.4");
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
              <ThemedText>Criar Lista</ThemedText>
            </View>
            <Pressable onPress={handleClose}>
              <ThemedView colorName="background.1" style={styles.closeButton}>
                <Feather name="x" size={18} color={optionIconColor} />
              </ThemedView>
            </Pressable>
          </View>

          <Input
            placeholder="Nome da lista"
            value={listName}
            onChangeText={(text) => {
              setIsError(false);
              setListName(text);
            }}
            iconName="repeat"
            onIconPress={() => handleGetRandomName()}
            capBorder="bottom"
            isError={isError}
          />

          <FlatList
            data={listNameSugestion}
            horizontal
            contentContainerStyle={styles.suggestionContainer}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <Pressable
                style={styles.suggestion}
                onPress={() => setListNameSugestion(item)}
                accessibilityRole="button"
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item}
          />

          <Feather
            name={!showMore ? "chevron-up" : "chevron-down"}
            size={24}
            style={styles.icon}
            onPress={toggleShowMore}
            color="rgb(197, 197, 197)"
          />

          {showMore && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={styles.budgetContainer}
            >
              <Input
                placeholder="Orçamento da lista"
                value={listBudget}
                onChangeText={setListBudget}
                keyboardType="numeric"
                capBorder="bottom"
                rightSection={
                  <View style={styles.budgetButtonContainer}>
                    <Pressable
                      style={styles.budgetButton}
                      onPress={handleDecrement}
                      accessibilityRole="button"
                    >
                      <Feather name="minus" size={16} color="rgb(18, 18, 18)" />
                    </Pressable>
                    <Pressable
                      style={styles.budgetButton}
                      onPress={handleIncrement}
                      accessibilityRole="button"
                    >
                      <Feather name="plus" size={16} color="rgb(18, 18, 18)" />
                    </Pressable>
                  </View>
                }
              />
            </Animated.View>
          )}

          <Pressable
            style={styles.createButton}
            onPress={handleCreateList}
            accessibilityRole="button"
          >
            <Text style={styles.createButtonText}>Criar lista</Text>
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

  openButton: {
    backgroundColor: "rgb(78, 78, 78)",
  },

  closeText: {
    color: "rgb(140, 140, 140)",
    fontSize: 14,
  },
  openText: {
    color: "rgb(236, 236, 236)",
    fontSize: 14,
  },
  suggestion: {
    backgroundColor: "rgba(245, 245, 245, 0.83)",
    borderWidth: 1,
    borderColor: "rgb(223, 223, 223)",
    borderRadius: 8,
    paddingHorizontal: 9,
    padding: 4,
  },
  separator: {
    width: 8,
  },
  collapseContainer: {
    flex: 1,
  },
  suggestionContainer: {
    marginTop: 8,
  },
  suggestionText: {
    color: "rgb(78, 78, 78)",
    fontSize: 12,
    textAlign: "center",
  },

  icon: {
    alignSelf: "center",
    padding: 8,
    borderRadius: 24,
  },
  createButton: {
    backgroundColor: "rgb(78, 78, 78)",
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  budgetContainer: {
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetButtonContainer: {
    flexDirection: "row",
    right: 0,
    justifyContent: "flex-end",
    gap: 8,
  },
  budgetButton: {
    backgroundColor: "rgb(255, 255, 255)",
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
