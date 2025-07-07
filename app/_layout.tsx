import { useEffect, useState } from "react";
import { registerForPushNotificationsAsync } from "../src/services/pushNotifications";
import { saveTokenToFirestore } from "../utils/firestoreService"; // Caminho corrigido
import * as Notifications from "expo-notifications";import {
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
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

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
        // Carrega os dados e registra para notificações em paralelo para otimizar o tempo
        await Promise.all([
          registerForPushNotificationsAsync().then(token => {
            if (token) {
              saveTokenToFirestore(token); // Chamando a função para salvar
            }
          }),
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
        console.error(
          "Erro ao carregar dados ou registrar notificações:",
          error
        );
        router.replace("/(tabs)");
      } finally {
        SplashScreen.hideAsync();
      }
    };
    prepareAndNavigate();

    // Listener para quando uma notificação é recebida com o app aberto
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificação recebida:", notification);
      }
    );

    // Listener para quando o usuário interage (clica) na notificação
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Resposta da notificação:", response);
        // Aqui você pode redirecionar o usuário para uma tela específica
        // router.push('/alguma-tela');
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
    
  }, []);

  if (!isConnected) return <NoConnectionScreen />;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
