import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../../constants/Theme/theme.js";
import { Header } from "../../../components/index.js";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "react-native"; // Importando o hook useColorScheme

const BuildDetail = () => {
  const { id, title, subCollection } = useLocalSearchParams();
  const router = useRouter(); // Hook para navegação no expo-router
  //console.log(subCollection);
  const loadouts = JSON.parse(subCollection); // Parse subCollection de volta para objeto
  const colorScheme = useColorScheme(); // Obtém o tema atual (light ou dark)
  //cor do backgroud
  const flatlistBackgroundColor =
    colorScheme === "dark" ? "#121212" : COLORS.card;

  const renderLoadout = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.img }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.weaponTypeBox}>
          <Text style={styles.weaponTypeText}>{item.weaponType}</Text>
        </View>
      </View>
      <Text style={styles.stats}>
        Dano: {item.stats.damage} | Alcance: {item.stats.range} | Precisão:{" "}
        {item.stats.accuracy}
      </Text>
      <Text style={styles.accessoriesHeader}>Acessórios:</Text>
      {item.accessories.map((accessory, index) => (
        <Text key={index} style={styles.accessory}>
          - {accessory}
        </Text>
      ))}
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <Header replace HeaderTittle={title} href={"/(tabs)"} />
      <ThemedView style={styles.container}>
        <FlatList
          data={loadouts}
          keyExtractor={(item) => item.id}
          renderItem={renderLoadout}
          contentContainerStyle={[
            styles.flatlist_container,
            { backgroundColor: flatlistBackgroundColor },
          ]}
          ListHeaderComponent={
            <ThemedText style={styles.header}>Loadouts Exclusivos</ThemedText>
          }
        />
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#121212",
  },
  flatlist_container: {
    padding: 10,
    //backgroundColor: "#121212",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    //color: "#FFFFFF",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  image: {
    width: "100%", // Faz a imagem ocupar toda a largura do container
    height: 100, // Define a altura fixa
    borderRadius: 10, // Aplica bordas arredondadas
    marginBottom: 10, // Dá uma margem abaixo da imagem
  },
  nameContainer: {
    flexDirection: "row", // Organiza os itens em linha
    alignItems: "center", // Alinha os itens no centro verticalmente
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    flex: 1, // Faz o nome ocupar o espaço restante
  },
  weaponTypeBox: {
    backgroundColor: "#2F4F4F", // Caixa com um fundo mais claro que o fundo do card
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  weaponTypeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  stats: {
    fontSize: 14,
    color: "#AAAAAA",
    marginVertical: 5,
  },
  accessoriesHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
  },
  accessory: {
    fontSize: 14,
    color: "#CCCCCC",
  },
});

export default BuildDetail;
