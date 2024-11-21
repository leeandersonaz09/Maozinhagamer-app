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
import { Header } from "../../components/index.js";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../Theme/theme.js";
import { useLocalSearchParams, useNavigation } from "expo-router";

const HomeCard = () => {
  const navigation = useNavigation();
  const { id, title, subCollection } = useLocalSearchParams();

  // Parse subCollection de volta para objeto
  const parsedSubCollection = JSON.parse(subCollection);

  const handlePress = (uri) => {
    if (uri.startsWith("http")) {
      Linking.openURL(uri);
    } else {
      navigation.navigate(uri);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.uri)}>
      <ImageBackground
        source={{ uri: item.img }}
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
      <Header replace HeaderTittle={title} href={"/(tabs)"} />
      <FlatList
        data={parsedSubCollection}
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

/*
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
    title: "Loadout | Meta Season",
    img: "https://www.gamespot.com/a/uploads/scale_medium/1639/16394540/4327631-mtz556.jpg",
    description: "Atualizado: Nov 11, 2024",
    uri: "https://wzstats.gg/pt",
  },
  {
    id: 2,
    title: "Mapas Interativos",
    img: "https://preview.redd.it/53vs0iydrehc1.png?width=640&crop=smart&auto=webp&s=e7bade6ebab594325aa946758a4ae5763fdb9a1d",
    description: "Escolha seu local de implantação em WARZONE, DMZ ou MWZ |  BO6",
    uri: "https://wzhub.gg/pt/map",
  },
  {
    id: 3,
    title: "Easter Eggs e Dicas",
    img: "https://i.ytimg.com/vi/VPlIZTm3yzY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDPIYE6HgB8x-wu8wPtDN_0TmELeQ",
    description: "Deixe o Mãozinha te dar uma mão no game!",
    uri: "/pagina-interna", // Use uma rota interna do app
  },
];

const HomeCard = (props) => {
  const navigation = useNavigation();
  const { id, title } = useLocalSearchParams();

  const handlePress = (uri) => {
    if (uri.startsWith("http")) {
       Linking.openURL(uri);
    } else {
      navigation.navigate(uri);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.uri)}
    >
      <ImageBackground
        source={{ uri: item.img }}
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
      <Header replace HeaderTittle={title} href={"/(tabs)"} />
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
*/
