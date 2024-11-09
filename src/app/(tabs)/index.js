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
import { getBannerData } from "../utils/apiRequests"; // Importe as funções

const Home = () => {
  const [data, setData] = useState([]);
  const [dataBanner, setdataBanner] = useState([]);
  const [dataNotes, setdataNotes] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  // Get Data for the Banner from Async Storage on refresh page
  const fetchBannerPulltoRefresh = async () => {
    setisLoading(true);
    const cachedData = await getBannerData();
    await AsyncStorage.setItem("bannerData", JSON.stringify(cachedData)); // Aguarde a conclusão da operação
    const getItem = await AsyncStorage.getItem("bannerData"); // Aguarde a conclusão da operação
    const parsedItem = await JSON.parse(getItem);
    setdataBanner(parsedItem);
    setTimeout(() => {
      setisLoading(false);
    }, 3000);
  };

  // Get Data for the Banner from Async Storage for pass dataBanner to component Carousel
  const retrieveBannerData = async () => {
    setisLoading(true);
    try {
      const getItem = await AsyncStorage.getItem("bannerData"); // Aguarde a conclusão da operação
      const parsedItem = await JSON.parse(getItem);
      setdataBanner(parsedItem);
      setisLoading(false);
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  // Get Data for the Banner from Async Storage for pass dataBanner to component Carousel
  const retrieveUpdateNotes = async () => {
    try {
      const getItem = await AsyncStorage.getItem("notesData"); // Aguarde a conclusão da operação
      const parsedItem = await JSON.parse(getItem);
      setdataNotes(parsedItem);
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  const retrieveWidgets = async () => {
    try {
      const getItem = await AsyncStorage.getItem("widgetsData"); // Aguarde a conclusão da operação
      const parsedItem = await JSON.parse(getItem);
      setData(parsedItem);
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  useEffect(() => {
    retrieveBannerData();
    retrieveUpdateNotes();
    retrieveWidgets();
  }, []);

  // Use useMemo para armazenar os dados em cache
  const memoizedData = useMemo(() => data, [data]);

  const renderItems = () => {
    return (
      <View style={styles.WigtesContainer}>
        <FlatList
          data={memoizedData}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) =>
            item.openInApp ? (
              <Link
                key={item.id}
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
            ) : (
              <Link key={item.id} href={{ pathname: item.href }} asChild>
                <TouchableOpacity style={styles.cardTouchable}>
                  <HomeCard data={item} />
                </TouchableOpacity>
              </Link>
            )
          }
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
        />
      </View>
    );
  };

  const SmallList = ({ item }) => {
    return (
      <View style={styles.SmallListContainer}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
          <View style={styles.Sitem}>
            <Image
              source={{
                uri: item.img,
              }}
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
                        style={{
                          width: 150,
                          height: 150,
                        }}
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
                        keyExtractor={(item) => item.id.toString()} // Usando id único como chave
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
        showsVerticalScrollIndicator={false} // Remove o indicador de rolagem vertical da FlatList principal
      />
    </>
  );
};

export default Home;
