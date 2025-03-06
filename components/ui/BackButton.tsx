import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

type BackButtonProps = {
  to?: "Home" | "List";
};
export const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const router = useRouter();
  const color = useThemeColor({}, "text.1");
  const border = useThemeColor({}, "text.8");
  const backgroundColor = useThemeColor({}, "background.1");

  return (
    <Pressable
      style={[styles.backButton, { borderColor: border, backgroundColor }]}
      onPress={() => router.back()}
    >
      <Feather name="chevron-left" size={20} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
