import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

/**
 * @param {{ width?: number | string, height?: number, borderRadius?: number }} props
 */
const Shimmer = ({ width = 200, height = 20, borderRadius = 5 }) => {
  const travelDistance = typeof width === "number" ? width : 240;
  const translateX = useRef(new Animated.Value(-travelDistance)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: travelDistance,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [travelDistance, translateX]);

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            width: typeof width === "number" ? width * 2 : "200%",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0", // Cor de fundo
    overflow: "hidden", // Garante que a animação não ultrapasse os limites
  },
  shimmer: {
    backgroundColor: "#f2f2f2", // Cor do shimmer
    height: "100%",
    borderRadius: 5, // Pode ser alterado via props
  },
});

export default Shimmer;
