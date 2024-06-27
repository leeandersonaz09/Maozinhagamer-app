import React from "react";
import { Text } from "react-native";
import {
  RectButton,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import styles from "./styles";

const Button = ({ variant = "default", label, onPress }) => {
  const backgroundColor =
    variant === "primary" ? "#1e213d" : "rgba(12, 13, 52, 0.05)";
  const color = variant === "primary" ? "#ffff" : "#0c0d34";

  return (
    <RectButton
      style={[styles.container, { backgroundColor }]}
      {...{ onPress }}
    >
      <Text style={[styles.label, { color }]}>{label}</Text>
    </RectButton>
  );
};

export default Button;
