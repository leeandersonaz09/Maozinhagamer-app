import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const SLIDE_HEIGHT = 0.61 * height;
export const BORDER_RADIUS = 75;

const styles = StyleSheet.create({
  container: {
    width,
  },
  titleContainer: {
    height: 100,
    justifyContent: "center",
  },
  title: {
    fontSize: 50,
    lineHeight: 70,
    fontFamily: "SFProDisplay_bold",
    color: "#ffff",
    textAlign: "center",
  },
});

// Definição de tipos para as props
type SlideProps = {
  title: string;
  right?: boolean; // Propriedade opcional
};

const Slide: React.FC<SlideProps> = ({ title, right = false }) => {
  const transform = [
    { translateY: (SLIDE_HEIGHT - 100) / 2 },
    { translateX: right ? width / 2 - 50 : -width / 2 + 50 },
    { rotate: right ? "-90deg" : "90deg" },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.titleContainer, { transform }]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default Slide;
