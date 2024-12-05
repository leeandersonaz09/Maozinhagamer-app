import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ModuleCard = ({ module }) => {
  const { classIcon, socketIcon, socketValue, moduleImage, name, rarity } =
    module;

  // Definição das cores baseadas na raridade
  const rarityColors = {
    common: "#1e293b",
    rare: "#0f172a",
    epic: "#7c3aed",
    legendary: "#d97706",
  };

  return (
    <View
      style={[
        styles.moduleCard,
        { backgroundColor: rarityColors[rarity] || "#0f172a" },
      ]}
    >
      <View style={styles.cardModuleClass}>
        <Image source={{ uri: classIcon }} style={styles.classIcon} />
      </View>
      <View style={styles.socketBanner}>
        <Image source={{ uri: socketIcon }} style={styles.socketIcon} />
        <Text style={styles.socketValue}>{socketValue}</Text>
      </View>
      <View style={styles.moduleImg}>
        <Image source={{ uri: moduleImage }} style={styles.moduleImage} />
      </View>
      <View style={styles.moduleName}>
        <Text style={styles.moduleText}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moduleCard: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: 120,
    height: 180,
  },
  cardModuleClass: {
    alignItems: "center",
    justifyContent: "center",
  },
  classIcon: {
    width: 24,
    height: 24,
  },
  socketBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  socketIcon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  socketValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  moduleImg: {
    marginVertical: 5,
  },
  moduleImage: {
    width: 90,
    height: 90,
  },
  moduleName: {
    marginTop: 5,
  },
  moduleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ModuleCard;
