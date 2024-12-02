import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Button, Header } from "../../../components/index.js";
import { StatusBar } from "expo-status-bar";
import { SIZES, COLORS } from "../../../constants/Theme/theme.js";
import { useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "react-native"; // Importando o hook useColorScheme
import { ThemedView } from "@/components/ThemedView";
import { ThemedScrollView } from "@/components/ThemedScrollView";

const Patrocinadores = () => {
  const { id, title, img, text, category, uri, button } =
    useLocalSearchParams();
  const colorScheme = useColorScheme(); // Obtém o tema atual (light ou dark)

  // Determina a cor de fundo do card com base no tema
  const titleColor = colorScheme === "dark" ? "#0FB700FF" : COLORS.primary;

  const handlePress = (uri) => {
    console.log(uri);
    if (uri.startsWith("http")) {
      Linking.openURL(uri);
    } else {
      //navigation.navigate(uri);
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <Header HeaderTittle={category} href={"/(tabs)"} />
      <ThemedScrollView>
        <View style={styles.patrocinadorContainer}>
          {/* Dados do patrocinador */}
          <ThemedText style={[styles.subtitle, { color: titleColor }]}>
            {title}
          </ThemedText>
          <Image source={{ uri: img }} style={styles.image} />
          <ThemedText style={styles.description}>{text}</ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handlePress(uri)}
            activeOpacity={0.7} // Opacidade ao tocar no botão
          >
            <ThemedText style={styles.buttonText}>
              {button ? button : "Saiba Mais"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedScrollView>
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
    //color: COLORS.primary,
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
    marginTop: 5,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2E0000", // Cor de fundo do botão (azul)
    paddingVertical: 15, // Espaçamento vertical
    paddingHorizontal: 30, // Espaçamento horizontal
    borderRadius: 25, // Cantos arredondados
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
