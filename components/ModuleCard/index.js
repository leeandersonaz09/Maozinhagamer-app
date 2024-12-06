import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ModuleImgBg from "../../assets/images/Module-bg.png";

const ModuleCard = ({ module }) => {
  const {
    "Module Image": moduleImage,
    "Module Name": name,
    "Module Type": type,
    "Class Icon": classIcon,
    "Socket Icon": socketIcon,
    "Socket Count": socketValue,
    "Module Rarity": rarity,
    "Module Link": moduleLink, // Novo campo para o link
  } = module;

  // Cores dinâmicas baseadas na raridade
  const rarityColors = {
    Standard: ["#3d6c8c", "#000", "#000", "#3d6c8c"],
    Rare: ["#511e7a", "#1a1a1a", "#1a1a1a", "#511e7a"],
    Ultimate: ["#988b5e", "#1a1a1a", "#1a1a1a", "#988b5e"],
    Transcendent: ["#843e2f", "#1a1a1a", "#1a1a1a", "#843e2f"],
  };

  const colors = rarityColors[rarity] || rarityColors.Standard;

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        //style={styles.moduleCard}
        onPress={() => Linking.openURL(moduleLink)} // Abre o link do módulo
      >
        <ImageBackground
          source={ModuleImgBg}
          style={styles.moduleCard}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.cardModuleClass}>
            <Image source={{ uri: classIcon }} style={styles.classIcon} />
          </View>
          <View style={styles.socketBanner}>
            <Image source={{ uri: socketIcon }} style={styles.socketIcon} />
            <Text style={styles.socketValue}>{socketValue}</Text>
          </View>
          <LinearGradient
            colors={colors}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.9 }}
            style={styles.moduleImg}
          >
            <Image source={{ uri: moduleImage }} style={styles.moduleImage} />
          </LinearGradient>
          <View style={styles.moduleName}>
            <Text style={styles.moduleText}>{name}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.moduleType}>
        <Text style={styles.moduleTypeText}>{type}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    margin: 10,
    alignItems: "center",
  },
  moduleCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: 150,
    minHeight: 180, // Defina uma altura mínima
    height: "auto", // Permite que a altura se ajuste conforme o conteúdo
    // overflow: "hidden", // Para evitar que conteúdo transborde
  },
  cardModuleClass: {
    position: "absolute",
    right: 5,
    top: 5,
  },
  classIcon: {
    width: 24,
    height: 24,
  },
  socketBanner: {
    position: "absolute",
    top: -10,
    backgroundColor: "#090e25",
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
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
  },
  moduleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  moduleType: {
    backgroundColor: "#131c30",
    borderRadius: 10,
    marginTop: 5,
    padding: 5,
    alignItems: "center",
  },
  moduleTypeText: {
    color: "#94a3b8",
    fontSize: 14,
  },
});

export default ModuleCard;
