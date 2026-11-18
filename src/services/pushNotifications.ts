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

const ANDROID_NOTIFICATION_CHANNELS: { id: string; name: string }[] = [
  { id: "default", name: "default" },
  { id: "live-alerts", name: "Alertas de Live" },
  { id: "meta-updates", name: "Atualizações de Meta" },
];

const hasNotificationPermission = (
  settings: Notifications.NotificationPermissionsStatus
): boolean => {
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

async function ensureAndroidNotificationChannels(): Promise<void> {
  if (Platform.OS !== "android") {
    return;
  }

  await Promise.all(
    ANDROID_NOTIFICATION_CHANNELS.map((channel) =>
      Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    )
  );
}

export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  try {
    await ensureAndroidNotificationChannels();

    let settings = await Notifications.getPermissionsAsync();

    if (!hasNotificationPermission(settings)) {
      settings = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowProvisional: true,
        },
      });
    }

    if (!hasNotificationPermission(settings)) {
      console.warn("Permissao para notificacoes nao concedida.");
      return undefined;
    }

    if (!Device.isDevice) {
      console.log(
        "Dispositivo fisico nao detectado; apenas notificacoes locais estarao disponiveis."
      );
      return undefined;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    if (!projectId) {
      console.warn(
        "EAS projectId nao configurado; push remoto ignorado e notificacoes locais ativas."
      );
      return undefined;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    console.log("Expo Push Token:", tokenResponse.data);
    return tokenResponse.data;
  } catch (error) {
    console.warn(
      "Falha ao registrar push remoto; mantendo notificacoes locais ativas:",
      error
    );
    return undefined;
  }
}
