import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
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
import { getBannerData, fetchWidgetsData } from "../utils/apiRequests"; // Importe as funções

const Home = () => {
  const [data, setData] = useState([]);
  const [dataBanner, setdataBanner] = useState([]);
  const [dataNotes, setdataNotes] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isLoading, setisLoading] = useState(false);

  //Get Data for the Banner from Async Storage on refrash page
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

  //Get Data for the Banner from Async Storage for pass dataBanner to component Carousel
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

  //Get Data for the Banner from Async Storage for pass dataBanner to component Carousel
  const retrieveUpdateNotes = async () => {
    try {
      const getItem = await AsyncStorage.getItem("notesData"); // Aguarde a conclusão da operação

      const parsedItem = await JSON.parse(getItem);
      setdataNotes(parsedItem);
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
    }
  };

  //Get from async storage Subscriber youtube counter
  const retrieveSubscriberCount = async () => {
    try {
      // Recupere o valor salvo no AsyncStorage
      const savedSubscriberCount = await AsyncStorage.getItem(
        "subscriberCount"
      );
      const subscriberCount = parseInt(savedSubscriberCount, 10) || 0;
      setSubscriberCount(subscriberCount);
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
      const subscriberCount = 0;
      setSubscriberCount(subscriberCount);
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
    retrieveSubscriberCount();
    retrieveBannerData();
    retrieveUpdateNotes();
    retrieveWidgets();
  }, []);

  // Use useMemo para armazenar os dados em cache
  const memoizedData = useMemo(() => data, [data]);

  const renderItems = () => {
    return (
      <View style={styles.WigtesContainer}>
        {memoizedData.map((item, index) =>
          item.openInApp ? (
            <Link
              key={index}
              push
              href={{
                pathname: "/HomeCard/[id]",
                params: {
                  id: item.id,
                  tittle: item.tittle,
                  uri: item.uri,
                },
              }}
              asChild
            >
              <TouchableOpacity>
                <HomeCard data={item} />
              </TouchableOpacity>
            </Link>
          ) : (
            <Link
              key={index}
              href={{
                pathname: item.href,
              }}
              asChild
            >
              <TouchableOpacity>
                <HomeCard data={item} />
              </TouchableOpacity>
            </Link>
          )
        )}
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
      <ScrollView
        showsVerticalScrollIndicator={false} // Esconde a barra de rolagem vertical
        refreshControl={
          <RefreshControl
            refreshing={isLoading} // Defina isso conforme sua lógica de carregamento
            onRefresh={fetchBannerPulltoRefresh} // Chame a função de atualização
          />
        }
      >
        <View style={styles.container}>
          <Image
            style={styles.headerImage}
            source={require("../assets/maozinha-home.jpg")}
          />
          <View
            style={[styles.contentContainer, { backgroundColor: COLORS.white }]}
          >
            <View style={styles.subscribeView}>
              <View style={styles.subscriberContainer}>
                <View style={styles.container1}>
                  <Text style={styles.subscriberText}> YouTube Inscritos</Text>
                </View>
                <View style={styles.container2}>
                  <Text style={[styles.subscriberCountText]}>
                    {subscriberCount}
                  </Text>
                </View>
              </View>

              <View style={styles.loadingView}>
                {isLoading ? (
                  <>
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
                        // Find more Lottie files at https://lottiefiles.com/featured
                        source={require("../assets/Lotties/hand 2.json")}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.BannerTittle}>
                      Ofertas Patrocinadas
                    </Text>
                    <Carousel data={dataBanner} />
                  </>
                )}
                {dataNotes ? (
                  <>
                    <Text style={styles.SmallListTittle}>Novidades</Text>

                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      horizontal
                      data={dataNotes}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={(item) => SmallList(item)}
                    />
                  </>
                ) : (
                  <></>
                )}

                <Text style={styles.WidgetsTittle}>Utilidades</Text>
                {renderItems()}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Home;
