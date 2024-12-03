import React, { useState, useEffect } from "react";
import { LottieLoading } from "../components";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  fetchWidgetsData,
  getBannerData,
  getMembers,
  fetchSponsors,
  fetchOffers,
  fetchAdsBanner,
  getUpdateNotes,
} from "../utils/apiRequests";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import NoConnectionScreen from "../components/NoConnectionScreen"; // Importe o componente

import { useColorScheme } from "@/hooks/useColorScheme"; // Suponho que você tenha esse hook
import NetInfo from "@react-native-community/netinfo";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Splash() {
  const colorScheme = useColorScheme(); // Usando hook para obter o esquema de cores
  const [isNew, setIsNew] = useState(true);
  const [isConnected, setIsConnected] = useState(true); // Estado de conexão
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SFProDisplay_bold: require("../assets/fonts/SFProDisplay_Bold.ttf"),
    SFProDisplay_regular: require("../assets/fonts/SFProDisplay_Regular.ttf"),
  });

  // Verificação de conexão
  useEffect(() => {
    setIsConnected(false);
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected); // Atualiza o estado de conexão
    });
    return () => unsubscribe();
  }, []);

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

  const checkIsNew = async () => {
    try {
      const value = await AsyncStorage.getItem("isnewinApp");
      if (value !== null) {
        setIsNew(false);
        //router.replace("/(tabs)");
      } else {
        setIsNew(true);
        //router.push("/welcome");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Carregar todos os dados necessários, verificando o cache e atualizando se necessário
    Promise.all([
      loadDataIfNeeded("bannerData", getBannerData),
      loadDataIfNeeded("membersData", getMembers),
      loadDataIfNeeded("notesData", getUpdateNotes),
      loadDataIfNeeded("widgetsData", fetchWidgetsData),
      loadDataIfNeeded("offersData", fetchOffers),
      loadDataIfNeeded("sponsorsData", fetchSponsors),
      loadDataIfNeeded("adsbannerData", fetchAdsBanner),
    ])
      .then(() => {
        setTimeout(() => {
          checkIsNew();
        }, 5000);
      })
      .catch((error) => {
        console.log("Erro ao carregar dados:", error);
      });

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  if (!isConnected) {
    return <NoConnectionScreen />;
  }
  return (
    <>
      <ThemeProvider
        screenOptions={{ headerShown: false }}
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack screenOptions={{ headerShown: false }}></Stack>
        <LottieLoading />
        <Stack screenOptions={{ headerShown: false }}>
          {isNew ? (
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </>
  );
}
