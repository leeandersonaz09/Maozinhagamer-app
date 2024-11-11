import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import styles from "../Theme/styles/HomeStyles";
import { HomeCard, Carousel } from "../components";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../Theme/theme";
import LottieView from "lottie-react-native";
import { getBannerData, fetchWidgetsData, getUpdateNotes } from "../utils/apiRequests"; // Importe as funções

const Home = () => {
  const [data, setData] = useState([]);
  const [dataBanner, setDataBanner] = useState([]);
  const [dataNotes, setDataNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Função para buscar dados do banner com tratamento de erros
  const fetchBannerPulltoRefresh = async () => {
    try {
      setIsLoading(true);
      const cachedData = await getBannerData();
      await AsyncStorage.setItem("bannerData", JSON.stringify(cachedData));
      const getItem = await AsyncStorage.getItem("bannerData");
      if (getItem) {
        const parsedItem = JSON.parse(getItem);
        setDataBanner(parsedItem);
      }
    } catch (error) {
      console.error("Erro ao obter dados do banner:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  // Função para recuperar dados do banner do AsyncStorage com tratamento de erros
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

  // Função para recuperar notas de atualização do AsyncStorage com tratamento de erros
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

  // Função para recuperar widgets do AsyncStorage com tratamento de erros
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

  useEffect(() => {
    retrieveBannerData();
    retrieveUpdateNotes();
    retrieveWidgets();
  }, []);

  // Memoizar dados para melhorar a performance
  const memoizedData = useMemo(() => data, [data]);

  // Função para renderizar os itens do FlatList
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
              //key={item.id}
              push
              href={{
                pathname: "/HomeCard/[id]",
                params: { id: item.id, tittle: item.tittle, uri: item.uri },
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

  // Componente para renderizar a lista pequena
  const SmallList = ({ item }) => {
    return (
      <View style={styles.SmallListContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
          <View style={styles.Sitem}>
            <Image
              source={{ uri: item.img }}
              style={styles.SitemPhoto}
              resizeMode="cover"
            />
            <View style={styles.StextContainer}>
              <Text style={styles.SitemText}>{item.tittle}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <FlatList
        data={dataBanner}
        keyExtractor={(item) => `banner-${item.id}`} // Adicione um prefixo para garantir unicidade
        ListHeaderComponent={
          <View style={styles.container}>
            <Image
              style={styles.headerImage}
              source={require("../assets/maozinha-home.jpg")}
            />
            <View style={[styles.contentContainer, { backgroundColor: COLORS.white }]}>
              <View style={styles.subscribeView}>
                <View style={styles.loadingView}>
                  {isLoading ? (
                    <View style={{ flex: 1, alignSelf: "center", alignItems: "center" }}>
                      <Text style={{ fontWeight: "bold" }}>Aguenta ai que estamos no meio da ranked MW3!</Text>
                      <Text style={{ fontWeight: "bold" }}>Já iremos atualizar!</Text>
                      <LottieView
                        autoPlay
                        style={{ width: 150, height: 150 }}
                        source={require("../assets/Lotties/hand 2.json")}
                      />
                    </View>
                  ) : (
                    <>
                      <Text style={styles.BannerTittle}>Ofertas Patrocinadas</Text>
                      <Carousel data={dataBanner} />
                    </>
                  )}
                  {dataNotes ? (
                    <>
                      <Text style={styles.SmallListTittle}>Canais Parceiros</Text>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        data={dataNotes}
                        keyExtractor={(item) => `note-${item.id}`} // Adicione um prefixo para garantir unicidade
                        renderItem={({ item }) => <SmallList item={item} />}
                      />
                    </>
                  ) : null}
                  <Text style={styles.WidgetsTittle}>Jogos</Text>
                  {renderItems()}
                </View>
              </View>
            </View>
          </View>
        }
        refreshing={isLoading}
        onRefresh={fetchBannerPulltoRefresh}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default Home;
