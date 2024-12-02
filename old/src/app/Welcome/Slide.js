import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
export const SLIDE_HEIGHT = 0.61 * height;
export const BORDER_RADIUS = 75;

const styles = StyleSheet.create({
  container: {
    width,
  },
  tittleContainer: {
    height: 100,
    fontFamily: "SFProDisplay_bold",
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

const Slide = ({ title, right }) => {
  const transform = [
    { translateY: (SLIDE_HEIGHT - 100) / 2 },
    { translateX: right ? width / 2 - 50 : -width / 2 + 50 },
    { rotate: right ? "-90deg" : "90deg" },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.tittleContainer, { transform }]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default Slide;
