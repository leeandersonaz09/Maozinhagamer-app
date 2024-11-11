import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Header } from "../components/index.js";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../Theme/theme.js";
import { useLocalSearchParams, useNavigation } from "expo-router";

const data = [
  {
    id: 1,
    title: "Exemplo de Título 1",
    uri: "https://t2.tudocdn.net/532605?w=1920",
    description: "Esta é a descrição fictícia para o primeiro item.",
    link: "https://wzhub.gg/pt/map",
  },
  {
    id: 2,
    title: "Exemplo de Título 2",
    uri: "https://t2.tudocdn.net/532605?w=1920",
    description: "Esta é a descrição fictícia para o segundo item.",
    link: "https://wzhub.gg/pt/map",
  },
  {
    id: 3,
    title: "Exemplo de Título 3",
    uri: "https://t2.tudocdn.net/532605?w=1920",
    description: "Esta é a descrição fictícia para o terceiro item.",
    link: "/pagina-interna", // Use uma rota interna do app
  },
];

const HomeCard = (props) => {
  const navigation = useNavigation();
  const { id, tittle, uri } = useLocalSearchParams();

  const handlePress = (link) => {
    if (link.startsWith("http")) {
      Linking.openURL(link);
    } else {
      navigation.navigate(link);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.link)}
    >
      <ImageBackground
        source={{ uri: item.uri }}
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 15, filter: "grayscale(100%)" }}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <Header replace HeaderTittle={tittle} href={"/(tabs)"} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 15,
    overflow: "hidden",
  },
  backgroundImage: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 100,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
});

export default HomeCard;
