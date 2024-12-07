import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ModuleCard from "../../../components/ModuleCard";
import modulesData from "../../../utils/modules_data.json"; // JSON com os detalhes dos módulos
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../../constants/Theme/theme.js";
import { Header, Separator } from "../../../components/index.js";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const DescendantBuild = () => {
  const [activeTab, setActiveTab] = useState("Modules");
  const { title, subCollection } = useLocalSearchParams();
  const router = useRouter(); // Hook para navegação no expo-router
  // Parse subCollection de volta para objeto
  const parsedSubCollection = JSON.parse(subCollection);

  //console.log(parsedSubCollection);

  // Preparando os dados para renderização
  const data = {
    characters: [
      {
        name: parsedSubCollection.name,
        image: parsedSubCollection.image,
        modules: parsedSubCollection.modules,
      },
    ],
    weapons: [
      {
        name: parsedSubCollection.weapons.name,
        image: parsedSubCollection.weapons.image,
        modules: parsedSubCollection.weapons.modules,
      },
    ],
  };

  const renderModules = (item) => {
    const moduleDetails = modulesData.find(
      (mod) => mod["Module Name"] === item
    );

    if (!moduleDetails) {
      return (
        <View style={styles.moduleCard}>
          <Text style={styles.moduleName}>Module not found: {item}</Text>
        </View>
      );
    }

    // Utiliza o componente `ModuleCard`
    return <ModuleCard module={moduleDetails} />;
  };

  const renderCharactersOrWeapons = (type) => {
    const dataList = type === "Modules" ? data.characters : data.weapons;

    if (!dataList || dataList.length === 0) {
      return (
        <Text style={styles.placeholderText}>No data available for {type}</Text>
      );
    }

    return (
      <FlatList
        data={dataList}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.characterCard}>
            <Image source={{ uri: item.image }} style={styles.characterImage} />
            <Text style={styles.characterName}>{item.name}</Text>
            <Separator />
            <FlatList
              data={item.modules}
              keyExtractor={(module, index) => `module-${index}`}
              renderItem={({ item }) => renderModules(item)}
              numColumns={2} // Exibe os módulos em duas colunas
              columnWrapperStyle={styles.row} // Ajusta espaçamento entre colunas
              contentContainerStyle={styles.listContent} // Padding geral para a lista
            />
          </View>
        )}
      />
    );
  };

  const renderDescendantBuild = () => (
    <Text style={styles.placeholderText}>
      Descendant Build content coming soon...
    </Text>
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <Header replace HeaderTittle={title} href={"/(tabs)"} />
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {["Modules", "Weapons", "Descendant Build"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.content}>
          {activeTab === "Modules" || activeTab === "Weapons"
            ? renderCharactersOrWeapons(activeTab)
            : renderDescendantBuild()}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030621" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  tab: { padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#00dc82" },
  tabText: { color: "#fff" },
  content: { flex: 1, padding: 10 },
  characterCard: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  characterImage: {
    width: "100%",
    height: 100,
    maxWidth: 300,
    resizeMode: "contain",
    alignSelf: "center",
  },
  characterName: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#fff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  row: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 20,
  },
  moduleCard: {
    margin: 5,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1b253d",
    borderRadius: 8,
  },
  moduleName: { color: "#fff", fontSize: 12, textAlign: "center" },
  placeholderText: { color: "#94a3b8", textAlign: "center", marginTop: 20 },
});

export default DescendantBuild;
