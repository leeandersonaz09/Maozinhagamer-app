import { useCallback, useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "../src/services/pushNotifications";
import { saveTokenToFirestore } from "../utils/firestoreService";
import * as Notifications from "expo-notifications";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../src/global.css";
import "react-native-reanimated";
import NoConnectionScreen from "../components/NoConnectionScreen";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { useColorScheme } from "../hooks/useColorScheme";
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
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AnimatedBrandSplash } from "../components/animated-brand-splash";

SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({
  duration: 250,
  fade: true,
});

export { ErrorBoundary } from "expo-router";

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (error) {
  console.log("[DEBUG] Erro ao definir notification handler:", error);
}

const TIMEOUT_MS = 10000;
type InitialRoute = "/welcome" | "/(tabs)";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isConnected = useNetworkStatus();
  const router = useRouter();
  const [isBootReady, setIsBootReady] = useState(false);
  const [showAnimatedSplash, setShowAnimatedSplash] = useState(false);
  const [initialRoute, setInitialRoute] = useState<InitialRoute>("/(tabs)");
  const bootStarted = useRef(false);
  const splashFinished = useRef(false);

  useEffect(() => {
    if (bootStarted.current) {
      return;
    }

    bootStarted.current = true;

    const prepareAndNavigate = async () => {
      console.log("[DEBUG] Iniciando prepareAndNavigate");

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout loading data")), TIMEOUT_MS)
      );

      try {
        await Promise.race([
          Promise.all([
            registerForPushNotificationsAsync()
              .then((token) => {
                if (token) {
                  saveTokenToFirestore(token).catch(() => {});
                }
              })
              .catch((err) => console.log("[DEBUG] Erro push notifications:", err)),
            loadDataIfNeeded("bannerData", getBannerData).catch(() => null),
            loadDataIfNeeded("membersData", getMembers).catch(() => null),
            loadDataIfNeeded("notesData", getUpdateNotes).catch(() => null),
            loadDataIfNeeded("widgetsData", fetchWidgetsData).catch(() => null),
            loadDataIfNeeded("offersData", fetchOffers).catch(() => null),
            loadDataIfNeeded("sponsorsData", fetchSponsors).catch(() => null),
            loadDataIfNeeded("adsbannerData", fetchAdsBanner).catch(() => null),
          ]),
          timeoutPromise,
        ]);

        console.log("[DEBUG] Dados carregados ou timeout atingido");
      } catch (error) {
        console.log("[DEBUG] Erro no prepareAndNavigate:", error);
      } finally {
        let nextRoute: InitialRoute = "/(tabs)";

        try {
          const isNewUser = await AsyncStorage.getItem("isnewinApp");
          console.log("[DEBUG] isNewUser:", isNewUser);
          nextRoute = isNewUser === null ? "/welcome" : "/(tabs)";
        } catch (navigationError) {
          console.log("[DEBUG] Erro ao navegar apos preparo inicial:", navigationError);
        }

        setInitialRoute(nextRoute);
        setShowAnimatedSplash(true);
        setIsBootReady(true);
      }
    };

    prepareAndNavigate();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[DEBUG] Notificacao recebida:", notification);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response?.notification?.request?.content?.data;
        if (data?.screen) {
          router.push(data.screen as any);
        } else {
          router.push("/(tabs)");
        }
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [router]);

  useEffect(() => {
    if (isBootReady || !isConnected) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isBootReady, isConnected]);

  const handleAnimatedSplashFinish = useCallback(() => {
    if (splashFinished.current) {
      return;
    }

    splashFinished.current = true;
    router.replace(initialRoute);
    setShowAnimatedSplash(false);
  }, [initialRoute, router]);

  if (!isConnected) {
    return <NoConnectionScreen />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }} />
        {showAnimatedSplash && (
          <AnimatedBrandSplash onFinish={handleAnimatedSplashFinish} />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
