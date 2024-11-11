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

  // Função para verificar se os dados em cache estão atualizados
  const loadDataIfNeeded = async (key, fetchFunction) => {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      const fetchedData = await fetchFunction();

      // Se não há dados em cache, armazene os dados atuais
      if (!cachedData) {
        await AsyncStorage.setItem(key, JSON.stringify(fetchedData));
        return fetchedData;
      }

      const parsedCachedData = JSON.parse(cachedData);

      // Verifique se os dados da API são diferentes dos dados em cache
      if (JSON.stringify(parsedCachedData) !== JSON.stringify(fetchedData)) {
        await AsyncStorage.setItem(key, JSON.stringify(fetchedData)); // Atualize o cache
        return fetchedData; // Retorne os dados atualizados
      }

      // Caso os dados sejam os mesmos, retorne o cache
      return parsedCachedData;
    } catch (error) {
      console.log(`Erro ao carregar dados de ${key}:`, error);
      return null;
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      SFProDisplay_bold: require("./Theme/fonts/SFProDisplay_Bold.ttf"),
      SFProDisplay_regular: require("./Theme/fonts/SFProDisplay_Regular.ttf"),
    });
    setFontsLoaded(true);
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

    // Carregar todos os dados necessários, verificando o cache e atualizando se necessário
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
