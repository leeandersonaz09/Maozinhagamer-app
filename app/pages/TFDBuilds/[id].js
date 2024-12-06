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

const data = {
  characters: [
    {
      name: "Ultimate Lepic",
      image:
        "https://tfdtools.com/_ipx/q_70&s_200x200/images/Icon_PC/Big/Icon_PC_List_001_U01.png",
      modules: [
        "Maximize Electric Resist",
        "Nimble Fingers",
        "Fire Specialist",
        "Technique Manual",
        "Supercooled Kuiper Round",
        "Toxic Gunbarrel",
        "Impact Round Charge Improvement",
      ],
    },
  ],
  weapons: [
    {
      name: "Flame Saber",
      image:
        "https://tfdtools.com/_ipx/q_70&s_560x166/images/Icon_Weapon/Big/Icon_RW_MG_1005_A001.png",
      modules: ["Heat Antibody", "Strong Mentality"],
    },
  ],
};

const TabsExample = () => {
  const [activeTab, setActiveTab] = useState("Modules");

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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030621" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1b253d",
    padding: 10,
  },
  tab: { padding: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#00dc82" },
  tabText: { color: "#fff" },
  content: { flex: 1, padding: 10 },
  characterCard: {
    marginBottom: 20, // Espaço inferior
    alignItems: "center", // Centraliza horizontalmente
    justifyContent: "center", // Centraliza verticalmente
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: "center", // Garante que a própria imagem se alinhe ao centro
  },
  characterName: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  row: {
    justifyContent: "space-between", // Espaço entre colunas no FlatList
  },
  listContent: {
    paddingBottom: 20, // Padding inferior para evitar corte
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

export default TabsExample;
