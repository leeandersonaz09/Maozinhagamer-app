import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Easing } from "react-native";

const Shimmer = ({ width = 200, height = 20, borderRadius = 5 }) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [width]);

  return (
    <View style={[styles.container, { width, height, borderRadius }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            width: width * 2, // O shimmer tem o dobro do tamanho para criar o efeito de movimento
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
