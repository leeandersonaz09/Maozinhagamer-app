// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation } from "expo-router";
import styles from "../../constants/Theme/styles/HomeStyles";
import { HomeCard, Carousel } from "../../components";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../../constants/Theme/theme";
import LottieView from "lottie-react-native";
import {
  getBannerData,
  fetchWidgetsData,
  getUpdateNotes,
} from "../../utils/apiRequests"; // Importe as funções
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
/*
Pagina trone liberty 
Mecanica de boss
Dicas e builds dos adms
*/

const Home = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [dataBanner, setDataBanner] = useState([]);
  const [dataNotes, setDataNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar e atualizar todos os dados do app
  const fetchAllData = async () => {
    try {
      setIsLoading(true);

      // Atualizar dados do banner
      const bannerData = await getBannerData();
      await AsyncStorage.setItem("bannerData", JSON.stringify(bannerData));
      const cachedBannerData = await AsyncStorage.getItem("bannerData");
      if (cachedBannerData) {
        setDataBanner(JSON.parse(cachedBannerData));
      }

      // Atualizar dados dos widgets
      const widgetsData = await fetchWidgetsData();
      await AsyncStorage.setItem("widgetsData", JSON.stringify(widgetsData));
      const cachedWidgetsData = await AsyncStorage.getItem("widgetsData");
      if (cachedWidgetsData) {
        setData(JSON.parse(cachedWidgetsData));
      }

      // Atualizar notas de atualização
      const notesData = await getUpdateNotes();
      await AsyncStorage.setItem("notesData", JSON.stringify(notesData));
      const cachedNotesData = await AsyncStorage.getItem("notesData");
      if (cachedNotesData) {
        setDataNotes(JSON.parse(cachedNotesData));
      }
    } catch (error) {
      console.error("Erro ao obter dados do Firestore:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000); // Ajuste o tempo de espera conforme necessário
    }
  };

  useEffect(() => {
    // Recuperar dados do AsyncStorage quando o componente é montado
    const retrieveData = async () => {
      await retrieveBannerData();
      await retrieveUpdateNotes();
      await retrieveWidgets();
    };
    retrieveData();
  }, []);

  // Função para recuperar dados do banner do AsyncStorage
  const retrieveBannerData = async () => {
    try {
      setIsLoading(true);
      const getItem = await AsyncStorage.getItem("bannerData");
      if (getItem) {
        const parsedItem = JSON.parse(getItem);
        setDataBanner(parsedItem);
      }
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para recuperar notas de atualização do AsyncStorage
  const retrieveUpdateNotes = async () => {
    try {
      const getItem = await AsyncStorage.getItem("notesData");
      if (getItem) {
        const parsedItem = JSON.parse(getItem);
        setDataNotes(parsedItem);
      }
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  // Função para recuperar widgets do AsyncStorage
  const retrieveWidgets = async () => {
    try {
      const getItem = await AsyncStorage.getItem("widgetsData");
      if (getItem) {
        const parsedItem = JSON.parse(getItem);
        setData(parsedItem);
      }
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  // Memoizar dados para melhorar a performance
  const memoizedData = useMemo(() => data, [data]);

  // Função para renderizar os itens do FlatList JOGOS DA HOME
  const renderItems = () => {
    return (
      <View style={styles.WigtesContainer}>
        <FlatList
          data={memoizedData}
          keyExtractor={(item) => `widget-${item.id}`} // Adicione um prefixo para garantir unicidade
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Link
              push
              href={{
                pathname: `/pages/HomeCard/${item.id}`, // Define o id diretamente no caminho da rota
                params: {
                  title: item.title,
                  subCollection: JSON.stringify(item.subCollection),
                }, // Passa os dados da sub-coleção
              }}
              asChild
            >
              <TouchableOpacity style={styles.cardTouchable}>
                <HomeCard data={item} />
              </TouchableOpacity>
            </Link>
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </View>
    );
  };

  const handlePress = (uri) => {
    if (uri.startsWith("http")) {
      Linking.openURL(uri);
    } else {
      navigation.navigate(uri);
    }
  };

  // Componente para renderizar a lista pequena CANAIS PARCEIROS
  const SmallList = ({ item }) => {
    return (
      <View style={styles.SmallListContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handlePress(item.uri);
          }}
        >
          <View style={styles.Sitem}>
            <Image
              source={{ uri: item.img }}
              style={styles.SitemPhoto}
              resizeMode="cover"
            />
            <View style={styles.StextContainer}>
              <Text style={styles.SitemText}>{item.title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <StatusBar
        backgroundColor={COLORS.primary}
        style="light"
        translucent={false}
      />
      <FlatList
        data={dataBanner}
        keyExtractor={(item) => `banner-${item.id}`} // Adicione um prefixo para garantir unicidade
        ListHeaderComponent={
          <ThemedView style={styles.container}>
            <Image
              style={styles.headerImage}
              source={require("../../assets/images/maozinha-home.jpg")}
            />
            <ThemedView style={[styles.contentContainer]}>
              <View style={styles.subscribeView}>
                <View style={styles.loadingView}>
                  {isLoading ? (
                    <View
                      style={{
                        flex: 1,
                        alignSelf: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        Aguenta ai que estamos no meio da ranked MW3!
                      </Text>
                      <Text style={{ fontWeight: "bold" }}>
                        Já iremos atualizar!
                      </Text>
                      <LottieView
                        autoPlay
                        style={{ width: 150, height: 150 }}
                        source={require("../../assets/Lotties/hand 2.json")}
                      />
                    </View>
                  ) : (
                    <>
                      <ThemedText style={styles.BannerTittle}>
                        Novidades
                      </ThemedText>
                      <Carousel data={dataBanner} />
                    </>
                  )}
                  {dataNotes ? (
                    <>
                      <ThemedText style={styles.SmallListTittle}>
                        Canais Parceiros
                      </ThemedText>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={dataNotes}
                        keyExtractor={(item) => `note-${item.id}`} // Adicione um prefixo para garantir unicidade
                        renderItem={({ item }) => <SmallList item={item} />}
                      />
                    </>
                  ) : null}
                  <ThemedText style={styles.WidgetsTittle}>Jogos</ThemedText>
                  {renderItems()}
                </View>
              </View>
            </ThemedView>
          </ThemedView>
        }
        refreshing={isLoading}
        onRefresh={fetchAllData}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default Home;
