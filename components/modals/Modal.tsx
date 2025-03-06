import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
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
