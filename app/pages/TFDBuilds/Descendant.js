import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../../constants/Theme/theme.js";
import {
  Header,
  Separator,
  CardComponent,
  ModuleCard,
  ReactorCard,
} from "../../../components/index.js";

const DescendantBuild = () => {
  const [activeTab, setActiveTab] = useState("Módulos");
  const [modulesData, setModulesData] = useState([]);
  const [charactersData, setCharactersData] = useState([]);
  const [reactorsData, setReactorsData] = useState([]);
  const [weponsData, setWeponData] = useState([]);
  const [componentsData, setComponentsData] = useState([]);
  const { title, subCollection } = useLocalSearchParams();
  const router = useRouter();

  const parsedSubCollection = JSON.parse(subCollection);
  // console.log(parsedSubCollection);
  useEffect(() => {
    const data = require("../../../utils/locales/pt/pt_modules_data.json");
    const reactors = require("../../../utils/locales/pt/reactors_data.json");
    const characters = require("../../../utils/locales/pt/characters_data.json");
    const components = require("../../../utils/locales/pt/components_data.json");
    const wepons = require("../../../utils/locales/pt/weapons_data.json");

    if (
      modulesData.length === 0 &&
      reactorsData.length === 0 &&
      weponsData.length === 0 &&
      componentsData.length === 0
    ) {
      setModulesData(data);
      setReactorsData(reactors);
      setComponentsData(components);
      setCharactersData(characters);
      setWeponData(wepons);
    }
  }, []);

  const data = {
    characters: [
      {
        name: parsedSubCollection?.name || "Desconhecido",
        modules: parsedSubCollection?.modules || [],
      },
    ],
    weapons: [
      {
        name: parsedSubCollection?.weapons?.name || "Desconhecido",
        image: parsedSubCollection?.weapons?.image || "",
        modules: parsedSubCollection?.weapons?.modules || [],
      },
    ],
    descendantBuild: [
      {
        name: parsedSubCollection?.descendantBuild?.name || "Desconhecido",
        modules: parsedSubCollection?.descendantBuild?.externalComponents || [],
      },
    ],
  };

  const RenderCharacter = ({ name }) => {
    const characterDetails = charactersData.find(
      (char) => char["Character Name"] === name
    );

    if (!characterDetails) {
      return (
        <View style={styles.moduleCard}>
          <Text style={styles.moduleName}>
            Personagem não encontrado: {name}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.characterSection}>
        <TouchableOpacity
          onPress={() => Linking.openURL(characterDetails["Character Link"])}
        >
          <Image
            source={{ uri: characterDetails["Character Image"] }}
            style={styles.characterImage}
          />
        </TouchableOpacity>
        <Text style={styles.characterName}>
          {characterDetails["Character Name"]}
        </Text>
      </View>
    );
  };

  const RenderWepons = ({ name }) => {
    const weponsDetails = weponsData.find(
      (char) => char["Weapon Name"] === name
    );

    // Extrair dados
    const {
      "Weapon Name": weponName,
      "Weapon Image": image,
      Rarity: rarity,
      "Weapon Link": weponLink,
    } = weponsDetails;
    if (!weponsDetails) {
      return (
        <View style={styles.moduleCard}>
          <Text style={styles.moduleName}>
            Personagem não encontrado: {name}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.characterSection}>
        <TouchableOpacity onPress={() => Linking.openURL(weponLink)}>
          <Image source={{ uri: image }} style={styles.weponImage} />
        </TouchableOpacity>
        <Text style={styles.weponName}>{weponName}</Text>
      </View>
    );
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
    return <ModuleCard module={moduleDetails} />;
  };

  const ReactorsComponent = ({ name }) => {
    const reactorsDetails = reactorsData.find(
      (mod) => mod["Reactor Name"] === name
    );

    if (!reactorsDetails) {
      return (
        <View style={styles.moduleCard}>
          <Text style={styles.moduleName}>Reator não encontrado: {name}</Text>
        </View>
      );
    }

    const { "Reactor Name": reactorName } = reactorsDetails;

    return (
      <View style={styles.reactorSection}>
        <Text style={styles.sectionTitle}>{reactorName || "Desconhecido"}</Text>
        <ReactorCard reactorsDetails={reactorsDetails} />
      </View>
    );
  };

  const ExternalComponents = ({ name }) => {
    // Buscar detalhes do componente pelo nome
    const componentsDetails = componentsData.find(
      (mod) => mod["Component Name"] === name
    );

    // Verificar se os detalhes foram encontrados
    if (!componentsDetails) {
      return (
        <View style={styles.moduleCard}>
          <Text style={styles.moduleName}>Component not found: {name}</Text>
        </View>
      );
    }

    return (
      <View style={styles.componentCard}>
        <CardComponent componentsDetails={componentsDetails} />
      </View>
    );
  };

  const renderCharacterSection = () => (
    <FlatList
      data={data.characters}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View style={styles.characterCard}>
          <RenderCharacter name={item?.name || "Desconhecido"} />
          <Separator />
          <FlatList
            data={item.modules}
            keyExtractor={(module, index) => `module-${index}`}
            renderItem={({ item }) => renderModules(item)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    />
  );

  const renderWeaponSection = () => (
    <FlatList
      data={data.weapons}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View style={styles.weponCard}>
          <RenderWepons name={item?.name || "Desconhecido"} />
          <Separator />
          <FlatList
            data={item.modules}
            keyExtractor={(module, index) => `module-${index}`}
            renderItem={({ item }) => renderModules(item)}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
          />
        </View>
      )}
    />
  );

  const renderDescendantBuild = () => {
    return (
      <View style={styles.descendantContainer}>
        {/* Seção do personagem */}
        <RenderCharacter name={parsedSubCollection?.name || "Desconhecido"} />
        {/* Seção do reator (componente reutilizável) */}
        <ReactorsComponent
          name={parsedSubCollection.descendantBuild?.name || "Desconhecido"}
        />

        {/* Seção dos componentes */}
        <View style={styles.componentsSection}>
          <Text style={styles.sectionTitle}>External Components</Text>
          <FlatList
            data={parsedSubCollection.descendantBuild.externalComponents}
            keyExtractor={(item) => item}
            numColumns={2}
            renderItem={({ item }) => <ExternalComponents name={item} />}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <Header replace HeaderTittle={title} href={"/(tabs)"} />
      <View style={styles.container}>
        <View style={styles.tabBar}>
          {["Módulos", "Armas", "Descendant Build"].map((tab) => (
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
          {activeTab === "Módulos"
            ? renderCharacterSection()
            : activeTab === "Armas"
            ? renderWeaponSection()
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
    width: 100,
    height: 100,
    maxWidth: 300,
    resizeMode: "contain",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 80,
    borderColor: "#fff",
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
  weponCard: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  weponImage: {
    width: 500,
    height: 100,
    maxWidth: 300,
    resizeMode: "stretch",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 80,
    borderColor: "#fff",
  },
  weponName: {
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
  descendantContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#030621",
  },
  characterSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  reactorSection: {
    marginVertical: 20,
    alignItems: "center",
  },
  componentsSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  reactorImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 50,
  },
  componentCard: {
    margin: 5,
    alignItems: "center",
  },
  componentImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 50,
  },
  componentName: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});

export default DescendantBuild;
