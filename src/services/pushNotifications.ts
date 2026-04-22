import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string | undefined;
  const hasPermission = (
    settings: Notifications.NotificationPermissionsStatus
  ) => {
    const normalized = settings as Notifications.NotificationPermissionsStatus & {
      granted?: boolean;
      status?: string;
    };

    return (
      normalized.granted === true ||
      normalized.status === "granted" ||
      normalized.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  };

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    let settings = await Notifications.getPermissionsAsync();

    if (!hasPermission(settings)) {
      settings = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowProvisional: true,
        },
      });
    }

    if (!hasPermission(settings)) {
      alert("Falha ao obter o token de push para notificacao!");
      return undefined;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })
    ).data;
    console.log("Expo Push Token:", token);
  } else {
    alert("E necessario usar um dispositivo fisico para receber notificacoes push.");
  }

  return token;
}
