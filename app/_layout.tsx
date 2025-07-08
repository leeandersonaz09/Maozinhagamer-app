import { useEffect, useState } from "react";
import { registerForPushNotificationsAsync } from "../src/services/pushNotifications";
import { saveTokenToFirestore } from "../utils/firestoreService";
import * as Notifications from "expo-notifications";
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
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

// Previne o auto-hide da splash screen
SplashScreen.preventAutoHideAsync();

// Exporta o ErrorBoundary para capturar erros na árvore de navegação
export { ErrorBoundary } from "expo-router";

// --- Manipulador de Notificações em Segundo Plano ---
// Adicionada uma verificação para evitar crash em versões mais antigas do SDK
// O ideal é garantir que a versão do 'expo-notifications' é compatível com seu SDK.
// A verificação 'if' anterior estava ocultando o erro real.
// Se esta linha causar um erro, significa que a função realmente não existe no objeto Notifications,
// o que reforça o problema de incompatibilidade de versão.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isConnected = useNetworkStatus();
  const router = useRouter();

  useEffect(() => {
    const prepareAndNavigate = async () => {
      try {
        // Carrega os dados e registra para notificações em paralelo
        await Promise.all([
          registerForPushNotificationsAsync().then((token) => {
            if (token) {
              saveTokenToFirestore(token);
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
        router.replace("/(tabs)"); // Rota de fallback em caso de erro
      } finally {
        SplashScreen.hideAsync();
      }
    };

    prepareAndNavigate();

    // Listener para quando uma notificação é recebida com o app aberto
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notificação recebida em primeiro plano:", notification);
      }
    );

    // Listener para quando o usuário interage (clica) na notificação
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "Resposta da notificação (interação):",
          JSON.stringify(response, null, 2)
        );

        const data = response.notification.request.content.data;
        if (data && data.screen) {
          router.push(data.screen as any);
        }
      });

    // Função de limpeza para remover os listeners
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  if (!isConnected) {
    return <NoConnectionScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
