import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type ListOptionsProps = {
  openListDetails?: () => void;
};

export const ListOptions: React.FC<ListOptionsProps> = ({
  openListDetails,
}) => {
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
          openListDetails?.();
        }}
      >
        <Feather name="edit" size={18} />
      </Pressable>
      <Pressable>
        <Feather name="trash" size={18} />
      </Pressable>
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
});
