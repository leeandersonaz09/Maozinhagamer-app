import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  Image,
  ScrollView,
  TouchableOpacity,
  safe,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import styles from "../Theme/styles//HomeStyles";
import { HomeCard, Carousel } from "../components";
import { COLORS } from "../Theme/theme";

const Home = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [data, setData] = useState([]);

  const fetchSubscriberCount = () => {
    fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCB8jsTfkY-7YP8ULi8mfuOw&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setSubscriberCount(data.items[0].statistics.subscriberCount);
        } else {
          console.log("Não foi possível encontrar o canal");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchSubscriberCount();
    setData([
      {
        key: 1,
        img: require("../assets/map-image.webp"),
        href: "/Maps",
        tittle: "Mapas Interativos",
      },
      {
        key: 2,
        img: require("../assets/meta-loadout.jpeg"),
        href: "/Loadouts",
        tittle: "Meta Loadouts",
      },
      {
        key: 3,
        img: require("../assets/youtube-card.png"),
        href: "vnd.youtube://www.youtube.com/@maozinhagamer_diih/streams",
        tittle: "Lives Youtube",
      },
      {
        key: 4,
        img: require("../assets/nos-ajude.jpg"),
        href: "/Pix",
        tittle: "Ajude com Pix",
      },
    ]);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchSubscriberCount();
  }, []);

  const renderItens = () => {
    return (
      <>
        <View style={styles.ProductContainer}>
          {data.map((data, index) => (
            <Link href={data.href} asChild>
              <TouchableOpacity key={index}>
                <HomeCard data={data} />
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} style="light" />
      <SafeAreaView style={{ backgroundColor: COLORS.white }}>
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
                  //marginTop: -10,
                },
              ]}
            >
              Bem-vindo a comunidade Maozinha Gamer!
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
                {renderItens()}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;