import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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

  const getWidgets = async () => {
    const widgets = await fetchWidgetsData();
    setData(widgets);
  };

  useEffect(() => {
    retrieveSubscriberCount();
    retrieveBannerData();
    getWidgets();
  }, []);

  // Use useMemo para armazenar os dados em cache
  const memoizedData = useMemo(() => data, [data]);

  const renderItems = () => {
    return (
      <View style={styles.ProductContainer}>
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

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <View style={{ flex: 1, backgroundColor: COLORS.white, marginTop: 0 }}>
        <ScrollView
          showsVerticalScrollIndicator={false} // Esconde a barra de rolagem vertical
          refreshControl={
            <RefreshControl
              refreshing={isLoading} // Defina isso conforme sua lógica de carregamento
              onRefresh={fetchBannerPulltoRefresh} // Chame a função de atualização
            />
          }
        >
          <Image
            style={styles.headerImage}
            source={require("../assets/maozinha-home.jpg")}
          />
          <View
            style={[styles.contentContainer, { backgroundColor: COLORS.white }]}
          >
            <Text
              style={[
                styles.Tittle,
                {
                  color: COLORS.black,
                  textAlign: "center",
                  marginHorizontal: 5,
                  marginTop: -10,
                },
              ]}
            >
              Bem-vindo à comunidade Maozinha Gamer!
            </Text>
            <View style={{ alignItems: "center", flex: 1 }}>
              <View style={styles.subscriberContainer}>
                <View style={styles.container1}>
                  <Text style={styles.subscriberCount}> YouTube Inscritos</Text>
                </View>
                <View style={styles.container2}>
                  <Text style={[styles.subscriberCount, { color: "black" }]}>
                    {subscriberCount}
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
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
                  <Carousel data={dataBanner} />
                )}

                {renderItems()}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default Home;
