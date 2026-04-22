import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchFeaturedLoadout } from './loadouts/api';

const BACKGROUND_META_TASK = 'background-meta-check';
const LAST_META_SLUG_KEY = 'last_meta_slug';

// Dynamic imports to prevent crash on environments without the native module
let BackgroundFetch: any;
let TaskManager: any;
let Notifications: any;

try {
  BackgroundFetch = require('expo-background-fetch');
  TaskManager = require('expo-task-manager');
  Notifications = require('expo-notifications');
} catch (e) {
  console.warn("Background Task native modules not found. Background features will be disabled.");
}

export const registerBackgroundTasks = async () => {
  if (!BackgroundFetch || !TaskManager) {
    console.warn("Background Task native modules not found.");
    return;
  }
  
  try {
    // Define task only when needed or once
    if (!TaskManager.isTaskDefined(BACKGROUND_META_TASK)) {
      TaskManager.defineTask(BACKGROUND_META_TASK, async () => {
        try {
          const featured = await fetchFeaturedLoadout();
          if (!featured) return BackgroundFetch.BackgroundFetchResult.NoData;

          const lastSlug = await AsyncStorage.getItem(LAST_META_SLUG_KEY);

          if (featured.slug !== lastSlug) {
            if (Notifications) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "🚨 NOVA META ABSOLUTA!",
                  body: `A ${featured.weapon} agora é a Absolute Meta no Warzone! Confira a build agora.`,
                  data: { slug: featured.slug },
                },
                trigger: null,
              });
            }

            await AsyncStorage.setItem(LAST_META_SLUG_KEY, featured.slug);
            return BackgroundFetch.BackgroundFetchResult.NewData;
          }

          return BackgroundFetch.BackgroundFetchResult.NoData;
        } catch (error) {
          console.error('Background task execution error:', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_META_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_META_TASK, {
        minimumInterval: 60 * 60 * 4, // 4 hours
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log('Background task registered');
    }
  } catch (err) {
    console.error('Task registration failed:', err);
  }
};
