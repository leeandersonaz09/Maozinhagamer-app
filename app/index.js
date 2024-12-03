import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";
import NoConnectionScreen from "../components/NoConnectionScreen"; // Importe o componente
import { useNetworkStatus } from "@/hooks/useNetworkStatus"; // Importe o hook para verificar a conexão
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  fetchWidgetsData,
  getBannerData,
  getMembers,
  fetchSponsors,
  fetchOffers,
  fetchAdsBanner,
  getUpdateNotes,
} from "../utils/apiRequests";
import { loadDataIfNeeded } from "../utils/globalFunctions";
import { LottieLoading } from "../components";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isNew, setIsNew] = useState(null); // Estado inicial como null para diferenciar o carregamento
  const [isLoading, setIsLoading] = useState(true); // Controle do carregamento
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SFProDisplay_bold: require("../assets/fonts/SFProDisplay_Bold.ttf"),
    SFProDisplay_regular: require("../assets/fonts/SFProDisplay_Regular.ttf"),
  });

  const checkIsNew = async () => {
    syncStorage.removeItem("isnewinApp");
    try {
      const value = await AsyncStorage.getItem("isnewinApp");
      if (value !== null) {
        setIsNew(false);
        router.replace("/(tabs)");
      } else {
        setIsNew(true);
        router.push("/welcome");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Usar o hook de verificação de conexão
  const isConnected = useNetworkStatus(); // Verifica a conexão
  //console.log("Conection status: " + isConnected);

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

  // Exibindo o LottieLoading enquanto o carregamento e o estado isNew não estiverem definidos
  if (isLoading || isNew === null || !loaded) {
    return <LottieLoading />;
  }

  if (!isConnected) {
    return <NoConnectionScreen />; // Exibe a tela de sem conexão
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <LottieLoading />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
