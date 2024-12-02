import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../../app/Theme/theme";
import metrics from "../../app/Theme/metrics";

export default function Card(props) {
  return (
    <View style={[styles.card, { backgroundColor: COLORS.card }]}>
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
