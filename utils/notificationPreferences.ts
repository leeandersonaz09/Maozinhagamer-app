import AsyncStorage from "@react-native-async-storage/async-storage";

export const NOTIFICATION_PREFERENCES_KEY = "notificationPreferences";

export type NotificationPreferences = {
  live: boolean;
  metaUpdates: boolean;
  promotions: boolean;
  games: Record<string, boolean>;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  live: true,
  metaUpdates: true,
  promotions: true,
  games: {
    "Call of Duty": true,
    "The First Descendant": true,
    Fortnite: true,
    "Throne and Liberty": true,
  },
};

export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    const storedValue = await AsyncStorage.getItem(
      NOTIFICATION_PREFERENCES_KEY
    );

    if (!storedValue) {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }

    const parsed = JSON.parse(storedValue);

    return {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...parsed,
      games: {
        ...DEFAULT_NOTIFICATION_PREFERENCES.games,
        ...(parsed?.games ?? {}),
      },
    };
  } catch (error) {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};

export const saveNotificationPreferences = async (
  preferences: NotificationPreferences
) => {
  await AsyncStorage.setItem(
    NOTIFICATION_PREFERENCES_KEY,
    JSON.stringify(preferences)
  );

  return preferences;
};
