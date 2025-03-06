import { useEffect } from "react";
import { BackHandler } from "react-native";

interface UseBackHandlerProps {
  condition: boolean;
  onBackPress: () => void;
}

export function useBackHandler({
  condition,
  onBackPress,
}: UseBackHandlerProps) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (condition) {
          onBackPress();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [condition, onBackPress]);
}
