import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import styles from "../Theme/styles/HomeStyles";
import { HomeCard, Carousel } from "../components";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../Theme/theme";
import LottieView from "lottie-react-native";

const Home = () => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  // Use useMemo para armazenar os dados em cache
  const memoizedData = useMemo(() => data, [data]);

  const fetchBannerPulltoRefresh = async () => {
    setisLoading(true);
    await fetch("https://restapimaozinhagamer.onrender.com/banner")
      .then((response) => response.json())
      .then((json) => {
        //console.log(json);
        AsyncStorage.setItem("bannerData", JSON.stringify(json)).then(
          setTimeout(() => {
            setisLoading(false);
          }, 3000)
        );
      })
      .catch((error) => {
        console.log(error);

        AsyncStorage.setItem(
          "bannerData",
          JSON.stringify([
            {
              id: 1,
              img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
              category: "Patrocinadores",
              tittle: "Maozinha Gamer",
              text: "Mãozinha Gamer é um canal no YouTube dedicado a conteúdo relacionado a jogos. Apresentamos gameplays variadas, dicas, truques e momentos épicos em jogos populares como Call of Duty: Warzone e Fortnite. Nossa comunidade, com mais de 4.820 inscritos, é apaixonada por videogames e interage ativamente nos comentários e nas transmissões ao vivo. Se você gosta de jogos, inscreva-se no canal para acompanhar as últimas novidades e se divertir com o conteúdo! 🎮🚀",
            },
          ])
        ).then(setisLoading(false));
      });
  };

  const retrieveSubscriberCount = async () => {
    try {
      // Recupere o valor salvo no AsyncStorage
      const savedSubscriberCount = await AsyncStorage.getItem(
        "subscriberCount"
      );
      // Atribua o valor diretamente à variável subscriberCount
      const subscriberCount = parseInt(savedSubscriberCount, 10) || 0;
      setSubscriberCount(subscriberCount);
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
      // Defina um valor padrão em caso de erro
      const subscriberCount = 0;
      setSubscriberCount(subscriberCount);
    }
  };

  useEffect(() => {
    retrieveSubscriberCount();
    setData([
      {
        id: 1,
        img: require("../assets/map-image.webp"),
        href: "/Maps",
        tittle: "Mapas Interativos",
        uri: "https://wzhub.gg/pt/map",
        openInApp: true,
      },
      {
        id: 2,
        img: require("../assets/meta-loadout.jpeg"),
        href: "/Loadouts",
        tittle: "Meta Loadouts",
        uri: "https://wzhub.gg/pt/loadouts",
        openInApp: true,
      },
      {
        id: 3,
        img: require("../assets/youtube-card.png"),
        href: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
        tittle: "Lives Youtube",
        uri: "",
        openInApp: false,
      },
      {
        id: 4,
        img: require("../assets/nos-ajude.jpg"),
        href: "/Pix",
        tittle: "Ajude com Pix",
        uri: "https://livepix.gg/diih145807",
        openInApp: true,
      },
    ]);
  }, []);

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
                  <Carousel />
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
