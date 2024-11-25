import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, Header } from "../../components/index.js";
import { StatusBar } from "expo-status-bar";
import { SIZES, COLORS } from "../Theme/theme.js";
import { useLocalSearchParams, router } from "expo-router";
import * as Linking from "expo-linking";

const Patrocinadores = () => {
  const { id, title, img, text, category, href, button } =
    useLocalSearchParams();

  const handlePress = () => {
    Linking.openURL(href).then(router.replace("/"));
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <Header HeaderTittle={category} href={"/(tabs)"} />
      <ScrollView>
        <View style={styles.patrocinadorContainer}>
          {/* Dados do patrocinador */}
          <Text style={styles.subtitle}>{title}</Text>
          <Image source={{ uri: img }} style={styles.image} />
          <Text style={styles.description}>{text}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.7} // Opacidade ao tocar no botão
          >
            <Text style={styles.buttonText}>
              {button ? button : "Saiba Mais"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    paddingLeft: 14,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingRight: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  patrocinadorContainer: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 20,
    marginBottom: 15,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: SIZES.header,
    color: COLORS.white,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2E0000", // Cor de fundo do botão (azul)
    paddingVertical: 15, // Espaçamento vertical
    paddingHorizontal: 30, // Espaçamento horizontal
    borderRadius: 8, // Cantos arredondados
    elevation: 3, // Sombra no Android
  },
  buttonText: {
    color: "#ffffff", // Cor do texto (branco)
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Patrocinadores;
