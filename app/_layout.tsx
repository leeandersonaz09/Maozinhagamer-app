import React, { useState, useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { SafeAreaView, View, StyleSheet, Platform } from "react-native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LottieLoading } from "../components";

import {
  fetchWidgetsData,
  getBannerData,
  getMembers,
  fetchSponsors,
  fetchOffers,
  fetchAdsBanner,
  getUpdateNotes,
} from "../utils/apiRequests";

// Evita que a splash screen desapareça antes do carregamento
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false); // Estado para definir se o app está pronto

  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SFProDisplay_bold: require("../assets/fonts/SFProDisplay_Bold.ttf"),
    SFProDisplay_regular: require("../assets/fonts/SFProDisplay_Regular.ttf"),
  });

  // Verifica se o usuário é novo
  const checkIsNewUser = async () => {
    try {
      const value = await AsyncStorage.getItem("isnewinApp");
      setIsNewUser(value === null);
    } catch (error) {
      console.error("Erro ao verificar se é novo usuário:", error);
      setIsNewUser(false);
    }
  };

  // Carrega os dados iniciais
  const initializeApp = async () => {
    try {
      await Promise.all([
        fetchWidgetsData(),
        getBannerData(),
        getMembers(),
        fetchSponsors(),
        fetchOffers(),
        fetchAdsBanner(),
        getUpdateNotes(),
      ]);
      await checkIsNewUser();
    } catch (error) {
      console.error("Erro ao inicializar o app:", error);
    } finally {
      setIsReady(true);
    }
  };

  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        await initializeApp();
        SplashScreen.hideAsync(); // Oculta a Splash Screen após o carregamento inicial
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  useEffect(() => {
    if (isReady && isNewUser !== null) {
      // Define a navegação com base no estado do novo usuário
      if (isNewUser) {
        router.push("/welcome");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isReady, isNewUser]);

  // Exibe o componente de loading enquanto os assets carregam
  if (!isReady || !fontsLoaded) {
    return <LottieLoading />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 40 : 0,
  },
});
