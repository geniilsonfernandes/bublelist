import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type BackdropProps = {
    onClose: () => void;
};
export const Backdrop: React.FC<BackdropProps> = ({ onClose }) => {
  return (
    <TouchableOpacity
      onPress={onClose}
      style={{
        position: "absolute",
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        justifyContent: "flex-end",
        left: 0,
        bottom: 0,
      }}
    >
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={{
          width: "100%",
          height: "50%",
        }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", "rgb(255, 255, 255)"]}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};
