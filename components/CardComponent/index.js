import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ComponentCard = ({ componentsDetails }) => {
  // Cores dinâmicas baseadas na raridade
  const rarityColors = {
    Standard: ["#3d6c8c", "#000", "#000", "#3d6c8c"],
    Rare: ["#511e7a", "#1a1a1a", "#1a1a1a", "#511e7a"],
    Ultimate: ["#988b5e", "#1a1a1a", "#1a1a1a", "#988b5e"],
    Transcendent: ["#843e2f", "#1a1a1a", "#1a1a1a", "#843e2f"],
  };
  // Extrair dados
  const {
    "Component Name": componentName,
    "Component Image": image,
    Rarity: rarity,
    "Component Link": componentLink,
  } = componentsDetails;

  const colors = rarityColors[rarity] || rarityColors.Standard;

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        //style={styles.moduleCard}
        onPress={() => Linking.openURL(componentLink)} // Abre o link do módulo
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0.1, y: 0.1 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.moduleImg}
        >
          <Image source={{ uri: image }} style={styles.moduleImage} />
        </LinearGradient>
        <View style={styles.moduleName}>
          <Text style={styles.moduleText}>{componentName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    margin: 10,
    alignItems: "center",
  },

  moduleImg: {
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    width: "70%",
    height: 90,
    borderColor: "#000000FF",
    borderWidth: 2,
  },
  moduleImage: {
    width: 90,
    height: 90,
  },
  moduleName: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ComponentCard;
