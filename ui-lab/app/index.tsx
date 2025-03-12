import {
  Pressable,
  PressableProps,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";

type ChipProps = {
  label: string;
} & PressableProps;

const Chip: React.FC<ChipProps> = ({ label, ...props }) => {
  return (
    <Pressable {...props}>
      <Text>{label}</Text>
    </Pressable>
  );
};

function get() {
  return String.fromCharCode(
    ...[108, 117, 108, 97, 32, 233, 32, 97, 109, 111, 114]
  );
}
export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "rgb(194, 194, 194)",
      }}
    >
      <Text style={styles.title}>What do you want to learn</Text>
      <Text style={styles.subtitle}>
        Select your areas of courses you would like to learn
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 600,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 400,
    textAlign: "left",
    color: "#6B7280",
  },
});
