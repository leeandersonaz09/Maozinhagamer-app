import React, { useState, useEffect, useRef } from "react";
import { LottieLoading } from "./components";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Font from "expo-font";
import {
  fetchSubscriberCount,
  fetchWidgetsData,
  getBannerData,
  getMembers,
  getUpdateNotes,
} from "./utils/apiRequests";

export default function Splash() {
  const [isNew, setIsNew] = useState(true);
  const [fontsLoaded, setfontsLoaded] = useState(false);

  async function SubscriberCount() {
    try {
      const subscriberCount = await fetchSubscriberCount();
      //console.log("subscriberCount", subscriberCount);
      // Salve o valor no AsyncStorage
      await AsyncStorage.setItem("subscriberCount", subscriberCount.toString());
    } catch (error) {
      console.error("Erro ao obter dados da API:", error);
    }
  }

  async function getWidgets() {
    const cachedData = await fetchWidgetsData();
    await AsyncStorage.setItem("widgetsData", JSON.stringify(cachedData)); // Aguarde a conclusão da operação
  }

  async function bannerData() {
    const cachedData = await getBannerData();
    await AsyncStorage.setItem("bannerData", JSON.stringify(cachedData)); // Aguarde a conclusão da operação
  }

  async function notesData() {
    const cachedData = await getUpdateNotes();
    await AsyncStorage.setItem("notesData", JSON.stringify(cachedData)); // Aguarde a conclusão da operação
  }

  async function membersData() {
    const cachedData = await getMembers();
    await AsyncStorage.setItem("membersData", JSON.stringify(cachedData)); // Aguarde a conclusão da operação
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
      //console.log(isNew);
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
    SubscriberCount();
    bannerData();
    membersData();
    notesData();
    getWidgets();

    setTimeout(() => {
      checkisNew();
    }, 5000);
  }, []);

  return <LottieLoading />;
}
