import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import ModuleCard from "../../../components/ModuleCard";
const CharacterBuild = () => {
  const [activeTab, setActiveTab] = useState("modules");

  // Dados fictícios
  const character = {
    name: "Ultimate Lepic",
    image:
      "https://tfdtools.com/_ipx/q_70&s_200x200/images/Icon_PC/Big/Icon_PC_List_001_U01.png",
    modules: [
      {
        id: "1",
        name: "Blood and Iron",
        rarity: "rare",
        classIcon:
          "https://tfdtools.com/_ipx/q_70&s_24x24/images/Icon_Runes/Icon_RunesClass_Mini_A_Color.png",
        socketIcon:
          "https://tfdtools.com/_ipx/q_70&s_24x24/images/IconSocketType/Almandine.png",
        socketValue: 6,
        moduleImage:
          "https://tfdtools.com/_ipx/q_70&s_90x90/images/Icon_Rune/Icon_RunesIcon_Conv_ATKToBlazer.png",
      },
      {
        id: "2",
        name: "Increased HP",
        rarity: "common",
        classIcon: "https://via.placeholder.com/24",
        socketIcon: "https://via.placeholder.com/24",
        socketValue: 4,
        moduleImage: "https://via.placeholder.com/90",
        moduleType: "Defense Boost",
      },
    ],
    cards: [
      {
        id: "1",
        image: "https://via.placeholder.com/60",
        name: "Materialized Phase Reactor",
      },
      {
        id: "2",
        image: "https://via.placeholder.com/60",
        name: "HP Support Auxiliary Power",
      },
    ],
  };

  const renderTabContent = () => {
    if (activeTab === "modules") {
      return (
        <FlatList
          data={character.modules}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <ModuleCard module={item} />
            </View>
          )}
          numColumns={2} // Mostra os módulos em colunas
          columnWrapperStyle={styles.row} // Ajusta espaçamento entre colunas
          contentContainerStyle={styles.listContent} // Padding geral para a lista
        />
      );
    } else {
      return (
        <FlatList
          data={character.cards}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          )}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com imagem e nome do personagem */}
      <View style={styles.header}>
        <Image
          source={{ uri: character.image }}
          style={styles.characterImage}
        />
        <Text style={styles.characterName}>{character.name}</Text>
      </View>

      {/* Tabs personalizadas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "modules" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("modules")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "modules" && styles.activeTabText,
            ]}
          >
            Modules
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "cards" && styles.activeTab]}
          onPress={() => setActiveTab("cards")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "cards" && styles.activeTabText,
            ]}
          >
            Cards
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da Tab */}
      <View style={styles.tabContent}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1F1F1F",
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  characterName: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2C2C2C",
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#3A3A3A",
  },
  tabText: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  row: {
    justifyContent: "space-between", // Espaço entre colunas no FlatList
  },
  listContent: {
    paddingBottom: 20, // Padding inferior para evitar corte
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  cardImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  cardText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

export default CharacterBuild;
