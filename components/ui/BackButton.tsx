import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

type BackButtonProps = {
  to?: "Home" | "List";
};
export const BackButton: React.FC<BackButtonProps> = ({ to }) => {
  const navigation = useNavigation("");
  const state = navigation.getState();

  const router = useRouter();
  const color = useThemeColor({}, "text.1");
  const border = useThemeColor({}, "text.8");
  const handlePress = () => {
    if (to === "Home") {
      router.replace("/");

      return;
    }
    if (to === "List") {
      return router.push("/list");
    }

    router.back();
  };
  return (
    <Pressable
      style={[styles.backButton, { borderColor: border }]}
      onPress={handlePress}
    >
      <Feather name="chevron-left" size={24} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
});
