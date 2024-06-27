import React, { useState, useEffect, useRef } from "react";
import { LottieLoading } from "./components";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";

export default function Splash() {
  const [isNew, setIsNew] = useState(true);
  const [fontsLoaded, setfontsLoaded] = useState(false);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCB8jsTfkY-7YP8ULi8mfuOw&key=AIzaSyCXKMARPazopeEURqx_itTOeIAT-uNwjNw"
      );
      const data = await response.json();
      if (data.items) {
        const subscriberCount = data.items[0].statistics.subscriberCount;

        // Salve o valor no AsyncStorage
        await AsyncStorage.setItem(
          "subscriberCount",
          subscriberCount.toString()
        );
      } else {
        console.log("Não foi possível encontrar o canal");
      }
    } catch (error) {
      console.error("Erro ao obter dados da API:", error);
    }
  };

  async function getBannerData() {
    try {
      const response = await fetch(
        "https://restapimaozinhagamer.onrender.com/banner"
      );
      const data = response.json();
      return data;
    } catch (error) {
      console.error("Erro ao obter dados da API:", error);
      return [
        {
          id: 1,
          img: "https://i.ytimg.com/vi/zoQoqNLTZtc/hq720_live.jpg",
          category: "Patrocinadores",
          tittle: "Maozinha Gamer",
          text: "Mãozinha Gamer é um canal no YouTube dedicado a conteúdo relacionado a jogos. Apresentamos gameplays variadas, dicas, truques e momentos épicos em jogos populares como Call of Duty: Warzone e Fortnite. Nossa comunidade, com mais de 4.820 inscritos, é apaixonada por videogames e interage ativamente nos comentários e nas transmissões ao vivo. Se você gosta de jogos, inscreva-se no canal para acompanhar as últimas novidades e se divertir com o conteúdo! 🎮🚀",
        },
      ];
    }
  }

  const loadFonts = async () => {
    await Font.loadAsync({
      SFProDisplay_bold: require("./Theme/fonts/SFProDisplay_Bold.ttf"),
      SFProDisplay_regular: require("./Theme/fonts/SFProDisplay_Regular.ttf"),
    }).then(() => {
      setfontsLoaded(true);
    });
  };

  const checkisNew = async () => {
    //AsyncStorage.clear();
    try {
      let value = await AsyncStorage.getItem("isnewinApp");
      console.log(isNew);
      if (value !== null) {
        setIsNew(false);
        router.replace("/(tabs)");
      } else {
        setIsNew(true);
        router.push("/Welcome");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!fontsLoaded) {
      loadFonts();
    }

    fetchSubscriberCount();

    const fetchData = async () => {
      const cachedData = await getBannerData(); // Tente obter dados em cache primeiro
      // Salve os dados no AsyncStorage
      await AsyncStorage.setItem("bannerData", JSON.stringify(cachedData));
    };

    fetchData();

    setTimeout(() => {
      checkisNew();
    }, 5000);
  }, []);

  return <LottieLoading />;
}
