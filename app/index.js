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
import { useLoadFonts } from "@/hooks/useLoadFonts";
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
import { loadDataIfNeeded, clearAsyncStorage } from "../utils/globalFunctions";
import { LottieLoading } from "../components";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isNew, setIsNew] = useState(null); // Estado inicial como null para diferenciar o carregamento
  const [isLoading, setIsLoading] = useState(true); // Controle do carregamento
  const colorScheme = useColorScheme();
  const isFontsLoaded = useLoadFonts();
  const isConnected = useNetworkStatus(); // Usar o hook de verificação de conexão
  /*
  //clearIsNew().then((clean) => console.log(clean)).catch((error) => console.error("Erro:", error));
  (async () => {
    const result = await clearAsyncStorage();
    console.log(result); // Mostra a mensagem de sucesso ou erro
  })();
*/
  const checkIsNew = async () => {
    try {
      const value = await AsyncStorage.getItem("isnewinApp");
      console.log("Valor retornado por AsyncStorage.getItem:", value); // Log do valor retornado
      if (value !== null) {
        setIsNew(false);
        router.replace("/(tabs)");
      } else {
        setIsNew(true);
        router.push("/welcome");
      }
    } catch (error) {
      console.error("Erro ao acessar AsyncStorage:", error); // Log de erro, caso ocorra
    }
  };

  useEffect(() => {
    // Função assíncrona encapsulada para melhor controle
    const loadData = async () => {
      try {
        // Carregar todos os dados necessários, verificando o cache e atualizando se necessário
        await Promise.all([
          loadDataIfNeeded("bannerData", getBannerData),
          loadDataIfNeeded("membersData", getMembers),
          loadDataIfNeeded("notesData", getUpdateNotes),
          loadDataIfNeeded("widgetsData", fetchWidgetsData),
          loadDataIfNeeded("offersData", fetchOffers),
          loadDataIfNeeded("sponsorsData", fetchSponsors),
          loadDataIfNeeded("adsbannerData", fetchAdsBanner),
        ]);

        // Após carregar os dados, verifica o status de novo usuário
        await checkIsNew();
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  if (!isFontsLoaded) return null;
  SplashScreen.hideAsync();

  if (!isConnected) {
    return <NoConnectionScreen />;
  }

  if (isLoading || isNew === null || !isFontsLoaded) {
    return <LottieLoading />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
