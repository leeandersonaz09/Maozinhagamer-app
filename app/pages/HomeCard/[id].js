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
import { Header } from "../../../components/index.js";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../../constants/Theme/theme.js";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const HomeCard = () => {
  const { title, subCollection } = useLocalSearchParams();
  const router = useRouter(); // Hook para navegação no expo-router

  // Parse subCollection de volta para objeto
  const parsedSubCollection = JSON.parse(subCollection);

  // Função para lidar com o redirecionamento
  const handlePress = (uri, id, item) => {
    if (uri.startsWith("http")) {
      // Redirecionamento para URLs externas
      Linking.openURL(uri);
    } else {
      // Redirecionamento interno usando o router do expo-router
      console.log(uri);
      router.push({
        pathname: `/pages/${uri}/${id}`, // Caminho dinâmico
        //pathname: `/pages/TFDBuilds/${id}`, // Caminho dinâmico
        params: {
          title: item.title,
          subCollection: JSON.stringify(item.loadouts),
        },
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.uri, item.id, item)}
    >
      <ImageBackground
        source={{ uri: item.img }}
        style={styles.backgroundImage}
        imageStyle={{ borderRadius: 15 }}
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
      <Header replace HeaderTittle={title} href={"/(tabs)"} />
      <ThemedView style={styles.container}>
        <FlatList
          data={parsedSubCollection}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.FlatListContainer}
        />
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  FlatListContainer: {
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
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Fundo escuro semi-transparente
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
