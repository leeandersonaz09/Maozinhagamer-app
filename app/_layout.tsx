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
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { clearAsyncStorage } from "../utils/globalFunctions";
SplashScreen.preventAutoHideAsync();

// Export a root error boundary to catch errors in the navigation tree
export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isConnected = useNetworkStatus();
  const router = useRouter();

  useEffect(() => {
    /*
    //clearIsNew().then((clean) => console.log(clean)).catch((error) => console.error("Erro:", error));
    (async () => {
      const result = await clearAsyncStorage();
      console.log(result); // Mostra a mensagem de sucesso ou erro
    })();
   */

    const prepareAndNavigate = async () => {
      try {
        // Pre-load all necessary data in parallel
        await Promise.all([
          loadDataIfNeeded("bannerData", getBannerData),
          loadDataIfNeeded("membersData", getMembers),
          loadDataIfNeeded("notesData", getUpdateNotes),
          loadDataIfNeeded("widgetsData", fetchWidgetsData),
          loadDataIfNeeded("offersData", fetchOffers),
          loadDataIfNeeded("sponsorsData", fetchSponsors),
          loadDataIfNeeded("adsbannerData", fetchAdsBanner),
        ]);

        const isNewUser = await AsyncStorage.getItem("isnewinApp");

        // Se 'isNewUser' for null, o usuário é novo.
        if (isNewUser === null) {
          router.replace("/welcome");
        } else {
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        router.replace("/(tabs)");
      } finally {
        SplashScreen.hideAsync();
      }
    };
    prepareAndNavigate();
  }, []);

  if (!isConnected) return <NoConnectionScreen />;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
