import AsyncStorage from "@react-native-async-storage/async-storage";
import type * as BackgroundFetchModule from "expo-background-fetch";
import type * as NotificationsModule from "expo-notifications";
import type * as TaskManagerModule from "expo-task-manager";
import { Platform } from "react-native";

import { getNotificationPreferences } from "../../utils/notificationPreferences";
import { fetchFeaturedLoadout } from "./loadouts/api";
import { getYouTubeLiveStatus } from "./youtube/liveStatus";

const BACKGROUND_META_TASK = "background-meta-check";
const LAST_META_SLUG_KEY = "last_meta_slug";
const LAST_META_NOTIFIED_AT_KEY = "@maozinha:last_notified_meta_at";
const LAST_LIVE_ID_KEY = "@maozinha:last_notified_live_id";
const LAST_LIVE_AT_KEY = "@maozinha:last_notified_live_at";
const WEEKLY_META_REMINDER_ID = "weekly-meta-reminder";
const LIVE_ALERTS_CHANNEL_ID = "live-alerts";
const META_UPDATES_CHANNEL_ID = "meta-updates";

const LIVE_RENOTIFY_INTERVAL_MS = 6 * 60 * 60 * 1000;
const META_WEEKLY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const WEEKLY_REMINDER_SECONDS = 7 * 24 * 60 * 60;

// Dynamic imports to prevent crash on environments without the native module
let BackgroundFetch: typeof BackgroundFetchModule | undefined;
let TaskManager: typeof TaskManagerModule | undefined;
let Notifications: typeof NotificationsModule | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  BackgroundFetch = require("expo-background-fetch");
} catch {
  console.warn("expo-background-fetch native module not found.");
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  TaskManager = require("expo-task-manager");
} catch {
  console.warn("expo-task-manager native module not found.");
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require("expo-notifications");
} catch {
  console.warn("expo-notifications native module not found.");
}

const hasNotificationPermission = (
  settings: NotificationsModule.NotificationPermissionsStatus
): boolean => {
  const normalized = settings as NotificationsModule.NotificationPermissionsStatus & {
    granted?: boolean;
    status?: string;
  };
  const provisionalStatus = Notifications?.IosAuthorizationStatus?.PROVISIONAL;

  return (
    normalized.granted === true ||
    normalized.status === "granted" ||
    (typeof provisionalStatus === "number" &&
      normalized.ios?.status === provisionalStatus)
  );
};

const canScheduleNotifications = async (): Promise<boolean> => {
  if (!Notifications) {
    return false;
  }

  const permissions = await Notifications.getPermissionsAsync();
  return hasNotificationPermission(permissions);
};

const parseStoredTimestamp = (rawValue: string | null): number => {
  if (!rawValue) {
    return 0;
  }

  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

// On Android SDK 55, immediate triggers must pass channelId in trigger to route to non-default channels
const buildImmediateTrigger = (
  channelId: string
): NotificationsModule.NotificationTriggerInput =>
  Platform.OS === "android" ? { channelId } : null;

const checkAndNotifyLive = async (): Promise<boolean> => {
  if (!Notifications) {
    return false;
  }

  try {
    const liveStatus = await getYouTubeLiveStatus();
    if (!liveStatus.isLive) {
      return false;
    }

    const liveId = liveStatus.videoId || liveStatus.startedAt || "live-active";
    const [lastLiveId, lastLiveAtRaw] = await Promise.all([
      AsyncStorage.getItem(LAST_LIVE_ID_KEY),
      AsyncStorage.getItem(LAST_LIVE_AT_KEY),
    ]);

    const lastLiveAt = parseStoredTimestamp(lastLiveAtRaw);
    const elapsedMs = lastLiveAt ? Date.now() - lastLiveAt : Infinity;
    const shouldNotify =
      liveId !== lastLiveId || elapsedMs > LIVE_RENOTIFY_INTERVAL_MS;

    if (!shouldNotify) {
      return false;
    }

    const body = liveStatus.title
      ? `${liveStatus.title} — Clique para entrar na live!`
      : "A live começou agora no YouTube! Clique para assistir.";

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔴 Mãozinha Gamer está AO VIVO!",
        body,
        data: {
          type: "live",
          url: liveStatus.url,
        },
      },
      trigger: buildImmediateTrigger(LIVE_ALERTS_CHANNEL_ID),
    });

    await Promise.all([
      AsyncStorage.setItem(LAST_LIVE_ID_KEY, liveId),
      AsyncStorage.setItem(LAST_LIVE_AT_KEY, String(Date.now())),
    ]);

    return true;
  } catch (error) {
    console.warn("Erro ao checar notificacao de live:", error);
    return false;
  }
};

const checkAndNotifyMeta = async (): Promise<boolean> => {
  if (!Notifications) {
    return false;
  }

  try {
    const featured = await fetchFeaturedLoadout();
    if (!featured?.slug) {
      return false;
    }

    const [lastSlug, lastMetaAtRaw] = await Promise.all([
      AsyncStorage.getItem(LAST_META_SLUG_KEY),
      AsyncStorage.getItem(LAST_META_NOTIFIED_AT_KEY),
    ]);

    const lastMetaAt = parseStoredTimestamp(lastMetaAtRaw);
    const isNewMeta = featured.slug !== lastSlug;
    const isWeeklyDue =
      !lastMetaAt || Date.now() - lastMetaAt >= META_WEEKLY_INTERVAL_MS;

    if (!isNewMeta && !isWeeklyDue) {
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: isNewMeta
          ? "🎯 Nova Meta no Warzone!"
          : "📅 Confira a Meta da Semana!",
        body: `A ${featured.weapon} (${featured.category}) está em destaque na Meta do Dia. Veja os acessórios!`,
        data: {
          type: "meta",
          screen: "/pages/Builds/featured",
          focus: featured.slug,
        },
      },
      trigger: buildImmediateTrigger(META_UPDATES_CHANNEL_ID),
    });

    await Promise.all([
      AsyncStorage.setItem(LAST_META_SLUG_KEY, featured.slug),
      AsyncStorage.setItem(LAST_META_NOTIFIED_AT_KEY, String(Date.now())),
    ]);

    return true;
  } catch (error) {
    console.warn("Erro ao checar notificacao de meta:", error);
    return false;
  }
};

let inFlightCheck: Promise<boolean> | null = null;

const runLiveAndMetaCheck = async (): Promise<boolean> => {
  if (!(await canScheduleNotifications())) {
    return false;
  }

  const prefs = await getNotificationPreferences();
  if (!prefs.live && !prefs.metaUpdates) {
    return false;
  }

  const results = await Promise.all([
    prefs.live ? checkAndNotifyLive() : Promise.resolve(false),
    prefs.metaUpdates ? checkAndNotifyMeta() : Promise.resolve(false),
  ]);

  return results.some(Boolean);
};

export const checkAndNotifyLiveAndMeta = async (): Promise<boolean> => {
  if (inFlightCheck) {
    return inFlightCheck;
  }

  inFlightCheck = runLiveAndMetaCheck().finally(() => {
    inFlightCheck = null;
  });

  return inFlightCheck;
};

export const ensureWeeklyMetaReminder = async (
  metaEnabled: boolean
): Promise<void> => {
  if (!Notifications) {
    return;
  }

  try {
    if (!metaEnabled) {
      await Notifications.cancelScheduledNotificationAsync(
        WEEKLY_META_REMINDER_ID
      );
      return;
    }

    if (!(await canScheduleNotifications())) {
      return;
    }

    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const isAlreadyScheduled = scheduled.some(
      (request) => request.identifier === WEEKLY_META_REMINDER_ID
    );

    if (isAlreadyScheduled) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      identifier: WEEKLY_META_REMINDER_ID,
      content: {
        title: "📅 Confira a Meta da Semana!",
        body: "Veja as armas em destaque e os melhores loadouts atualizados no app.",
        data: {
          type: "meta",
          screen: "/pages/Builds/featured",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: WEEKLY_REMINDER_SECONDS,
        repeats: true,
        ...(Platform.OS === "android"
          ? { channelId: META_UPDATES_CHANNEL_ID }
          : {}),
      },
    });
  } catch (error) {
    console.warn("Erro ao atualizar lembrete semanal da meta:", error);
  }
};

// Expo TaskManager requires defineTask to be called at the module top-level scope
if (TaskManager && !TaskManager.isTaskDefined(BACKGROUND_META_TASK)) {
  TaskManager.defineTask(BACKGROUND_META_TASK, async () => {
    try {
      const hasNewNotification = await checkAndNotifyLiveAndMeta();
      if (!BackgroundFetch) {
        return undefined;
      }

      return hasNewNotification
        ? BackgroundFetch.BackgroundFetchResult.NewData
        : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
      console.error("Background task execution error:", error);
      return BackgroundFetch?.BackgroundFetchResult.Failed;
    }
  });
}

export const registerBackgroundTasks = async (): Promise<void> => {
  try {
    const prefs = await getNotificationPreferences();
    await ensureWeeklyMetaReminder(prefs.metaUpdates);

    if (!BackgroundFetch || !TaskManager) {
      console.warn("Background Task native modules not found.");
      return;
    }

    if (!TaskManager.isTaskDefined(BACKGROUND_META_TASK)) {
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_META_TASK
    );

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_META_TASK, {
        minimumInterval: 60 * 60 * 4,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Background task registered");
    }
  } catch (err) {
    console.error("Task registration failed:", err);
  }
};
