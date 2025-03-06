import { useBackHandler } from "@/hooks/useBackHandler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useModals } from "@/store/useModals";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { Header } from "./Header";
import { ProductEditEntry } from "./ProductEntry";
import { Input } from "./ui/Input";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";
import { ValueInput } from "./ValueInput";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const background = useThemeColor({}, "background");

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <LinearGradient
          // Background Linear Gradient
          colors={["transparent", background]}
          end={{ x: 0.3, y: 0.6 }}
          style={{
            flex: 1,
          }}
        />
      </TouchableWithoutFeedback>
      <Animated.View style={styles.content}>{children}</Animated.View>
    </Animated.View>
  );
};

const EditModal = () => {
  const { clearSelectedProduct, selectedProduct } = useModals();

  useBackHandler({
    condition: !!selectedProduct,
    onBackPress: clearSelectedProduct,
  });

  return (
    <Modal onClose={() => clearSelectedProduct()}>
      <ProductEditEntry />
    </Modal>
  );
};

const ListEditModal = () => {
  const { selectedList, clearSelectedList } = useModals();

  const [value, setValue] = useState(selectedList?.budget || null);

  useBackHandler({
    condition: !!selectedList,
    onBackPress: clearSelectedList,
  });

  return (
    <Modal onClose={() => clearSelectedList()}>
      <View
        style={{
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Header title={selectedList?.name || "Nova lista"} />
        <Input value={selectedList?.name} showActions={false} />
        <ValueInput
          value={value}
          onChangeValue={(value) => setValue(value)}
          controlButtons
        />
        <ThemedView
          backgroundColor={"background.2"}
          style={{
            height: 1,
            marginHorizontal: 12,
            marginVertical: 8,
          }}
        />
        <ThemedView
          borderColor={"background.2"}
          backgroundColor={"background.1"}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            padding: 12,
            borderRadius: 8,
            height: 48,
          }}
        >
          <Feather name="trash" size={18} />
          <ThemedText>Apagar lista</ThemedText>
        </ThemedView>
      </View>
    </Modal>
  );
};

export const Modals = () => {
  const { selectedProduct, selectedList } = useModals();

  return (
    <>
      {selectedProduct && <EditModal />}
      {selectedList && <ListEditModal />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 16,
    paddingHorizontal: 16,
    zIndex: 101,
  },
});
