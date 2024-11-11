import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { COLORS, SIZES } from "../../Theme/theme";
import { Link } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function Header(props) {
  const { HeaderTittle: title, href: route } = props;
  return (
    <View style={styles.header}>
      {props.children}
      <View style={styles.headerContent}>
        {route && (
          <Link href={route} asChild>
            <TouchableOpacity style={styles.backButton}>
              <FontAwesome name="arrow-circle-left" size={38} color="white" />
            </TouchableOpacity>
          </Link>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.HeaderTittle}>{title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    width: "100%",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 14,
  },
  backButton: {
    position: "absolute",
    left: 14,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  HeaderTittle: {
    fontSize: SIZES.headerTittle,
    color: COLORS.white,
    fontWeight: "bold",
  },
});
