import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import styles from "../Theme/styles//HomeStyles";
import { HomeCard } from "../components";
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
        href: "/",
        tittle: "Meta Loadouts",
      },
      {
        key: 3,
        img: require("../assets/maozinha-home.jpg"),
        href: "/",
        tittle: "Sapatos",
      },
      {
        key: 4,
        img: require("../assets/maozinha-home.jpg"),
        href: "/",
        tittle: "Sapatos",
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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.statusbar} style="light" />
      <ScrollView style={styles.container}>
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
                marginTop: -20,
              },
            ]}
          >
            Bem-vindo a comunidade Maozinha Gamer!
          </Text>
          <View style={{ alignItems: "center" }}>
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
            {renderItens()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
