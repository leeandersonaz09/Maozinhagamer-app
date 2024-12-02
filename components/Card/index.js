import React from "react";
import { View, StyleSheet } from "react-native";
import { useColorScheme } from "react-native"; // Importando o hook useColorScheme
import { COLORS } from "../../constants/Theme/theme";
import metrics from "../../constants/Theme/metrics";

export default function Card(props) {
  const colorScheme = useColorScheme(); // Obtém o tema atual (light ou dark)

  // Determina a cor de fundo do card com base no tema
  const cardBackgroundColor =
    colorScheme === "dark" ? "#1C1C1CFF" : COLORS.card;

  return (
    <View style={[styles.card, { backgroundColor: cardBackgroundColor }]}>
      <View style={styles.cardContent}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginHorizontal: 4,
    marginVertical: 6,
  },

  cardContent: {
    marginHorizontal: metrics.meedleBaseMargin,
    marginVertical: metrics.baseMargin,
    padding: 5,
  },
});
