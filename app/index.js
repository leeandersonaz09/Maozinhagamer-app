import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-reanimated";
import NoConnectionScreen from "../components/NoConnectionScreen";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
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
import { loadDataIfNeeded } from "../utils/globalFunctions";
import { LottieLoading } from "../components";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { clearAsyncStorage } from "../utils/globalFunctions";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isNew, setIsNew] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isFontsLoaded = useLoadFonts();
  const isConnected = useNetworkStatus();

  const checkIsNew = async () => {
    try {
      const value = await AsyncStorage.getItem("isnewinApp");
      setIsNew(value === null);
    } catch (error) {
      console.error("Erro ao acessar AsyncStorage:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
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
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
        await SplashScreen.hideAsync();
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    /*
    //clearIsNew().then((clean) => console.log(clean)).catch((error) => console.error("Erro:", error));
    (async () => {
      const result = await clearAsyncStorage();
      console.log(result); // Mostra a mensagem de sucesso ou erro
    })();
   */

    if (isNew !== null) {
      if (isNew) {
        router.push("/welcome");
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isNew]);

  if (!isConnected) {
    return <NoConnectionScreen />;
  }

  if (isLoading || !isFontsLoaded) {
    return <LottieLoading />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
