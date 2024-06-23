import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import styles from "../Theme/styles/HomeStyles";
import { HomeCard, Carousel } from "../components";
import { COLORS } from "../Theme/theme";

const Home = () => {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [data, setData] = useState([]);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCB8jsTfkY-7YP8ULi8mfuOw&key=YOUR_API_KEY"
      );
      const data = await response.json();
      if (data.items) {
        setSubscriberCount(data.items[0].statistics.subscriberCount);
      } else {
        console.log("Não foi possível encontrar o canal");
      }
    } catch (error) {
      console.error("Erro ao obter dados da API:", error);
      setSubscriberCount(0); // Defina um valor padrão em caso de erro
    }
  };

  useEffect(() => {
    fetchSubscriberCount();
    setData([
      {
        id: 1,
        img: require("../assets/map-image.webp"),
        uri: "https://wzhub.gg/pt/map",
        tittle: "Mapas Interativos",
        openInWeb: true,
      },
      {
        id: 2,
        img: require("../assets/meta-loadout.jpeg"),
        uri: "https://wzhub.gg/pt/loadouts",
        tittle: "Meta Loadouts",
        openInWeb: true,
      },
      {
        id: 3,
        img: require("../assets/youtube-card.png"),
        uri: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
        tittle: "Lives Youtube",
        openInWeb: false,
      },
      {
        id: 4,
        img: require("../assets/nos-ajude.jpg"),
        uri: "https://livepix.gg/diih145807",
        tittle: "Ajude com Pix",
        openInWeb: true,
      },
    ]);
  }, []);

  // Use useMemo para armazenar os dados em cache
  const memoizedData = useMemo(() => data, [data]);

  const renderItems = () => {
    return (
      <View style={styles.ProductContainer}>
        {memoizedData.map((item, index) => (
          <Link
            key={index}
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
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView>
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
              <Carousel />
              {renderItems()}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
