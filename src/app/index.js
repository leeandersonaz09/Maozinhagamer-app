import React, { useState, useEffect } from "react";
import { LottieLoading } from "./components";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import {
  fetchWidgetsData,
  getBannerData,
  getMembers,
  getUpdateNotes,
} from "./utils/apiRequests";

export default function Splash() {
  const [isNew, setIsNew] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Função para verificar se já temos dados em cache ou precisamos fazer uma nova requisição
  const loadDataIfNeeded = async (key, fetchFunction) => {
    const cachedData = await AsyncStorage.getItem(key);

    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      const data = await fetchFunction();
      await AsyncStorage.setItem(key, JSON.stringify(data)); // Armazenar em cache
      return data;
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      SFProDisplay_bold: require("./Theme/fonts/SFProDisplay_Bold.ttf"),
      SFProDisplay_regular: require("./Theme/fonts/SFProDisplay_Regular.ttf"),
    }).then(() => {
      setFontsLoaded(true);
    });
  };

  const checkIsNew = async () => {
    try {
      const value = await AsyncStorage.getItem("isnewinApp");
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

    // Carregar todos os dados necessários, verificando o cache
    Promise.all([
      loadDataIfNeeded("bannerData", getBannerData),
      loadDataIfNeeded("membersData", getMembers),
      loadDataIfNeeded("notesData", getUpdateNotes),
      loadDataIfNeeded("widgetsData", fetchWidgetsData),
    ])
      .then(() => {
        setTimeout(() => {
          checkIsNew();
        }, 5000);
      })
      .catch((error) => {
        console.log("Erro ao carregar dados:", error);
      });
  }, [fontsLoaded]);

  return <LottieLoading />;
}
