import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { LottieLoading } from "../components";
import NoConnectionScreen from "../components/NoConnectionScreen"; // Importe o componente
import NetInfo from "@react-native-community/netinfo";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchWidgetsData,
  getBannerData,
  getMembers,
  fetchSponsors,
  fetchOffers,
  fetchAdsBanner,
  getUpdateNotes,
} from "../utils/apiRequests";
import * as SplashScreen from "expo-splash-screen";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isNew, setIsNew] = useState(null); // Estado inicial como `null` para diferenciar o carregamento
  const [isConnected, setIsConnected] = useState(true); // Estado inicial como `true`
  const [isLoading, setIsLoading] = useState(true); // Controle do carregamento
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SFProDisplay_bold: require("../assets/fonts/SFProDisplay_Bold.ttf"),
    SFProDisplay_regular: require("../assets/fonts/SFProDisplay_Regular.ttf"),
  });

  useEffect(() => {
    //setIsConnected(false);
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected); // Atualiza o estado de conexão
    });
    return () => unsubscribe();
  }, []);

  const loadDataIfNeeded = async (key, fetchFunction) => {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      const fetchedData = await fetchFunction();

      if (!cachedData) {
        await AsyncStorage.setItem(key, JSON.stringify(fetchedData));
        return fetchedData;
      }

      const parsedCachedData = JSON.parse(cachedData);

      if (JSON.stringify(parsedCachedData) !== JSON.stringify(fetchedData)) {
        await AsyncStorage.setItem(key, JSON.stringify(fetchedData));
        return fetchedData;
      }

      return parsedCachedData;
    } catch (error) {
      console.log(`Erro ao carregar dados de ${key}:`, error);
      return null;
    }
  };

  const checkIsNew = async () => {
    try {
      const value = await AsyncStorage.getItem("isnewinApp");
      setIsNew(value === null); // Atualiza o estado com base no valor armazenado
    } catch (error) {
      console.log(error);
      setIsNew(false); // Por segurança, redireciona para o fluxo padrão
    }
  };

  useEffect(() => {
    const loadAppData = async () => {
      try {
        await Promise.all([
          loadDataIfNeeded("bannerData", getBannerData),
          loadDataIfNeeded("membersData", getMembers),
          loadDataIfNeeded("notesData", getUpdateNotes),
          loadDataIfNeeded("widgetsData", fetchWidgetsData),
          loadDataIfNeeded("offersData", fetchOffers),
          loadDataIfNeeded("sponsorsData", fetchSponsors),
          loadDataIfNeeded("adsbannerData", fetchAdsBanner),
        ]);
        await checkIsNew();
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
        if (loaded) SplashScreen.hideAsync();
      }
    };

    loadAppData();
  }, [loaded]);

  if (isLoading || !loaded) {
    return <LottieLoading />;
  }

  if (!isConnected) {
    return <NoConnectionScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
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
  );
}
