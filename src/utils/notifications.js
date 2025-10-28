import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STORAGE_KEYS = {
  NOTIFICATION_SETTINGS: "aivy_notification_settings",
  NOTIFICATION_PERMISSIONS: "aivy_notification_permissions",
};

class NotificationManager {
  constructor() {
    this.isInitialized = false;
    this.defaultSettings = {
      breakfast_reminder: true,
      lunch_reminder: true,
      dinner_reminder: true,
      water_reminder: true,
      breakfast_time: "08:00",
      lunch_time: "13:00",
      dinner_time: "19:00",
      water_interval_hours: 2,
    };
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      await this.requestPermissions();

      // Load settings
      await this.loadSettings();

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
    }
  }

  async requestPermissions() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Notification permissions not granted");
      return false;
    }

    // Store permission status
    await AsyncStorage.setItem(
      STORAGE_KEYS.NOTIFICATION_PERMISSIONS,
      "granted",
    );

    // Configure notification channel for Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Aivy Health Reminders",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });

      await Notifications.setNotificationChannelAsync("meal-reminders", {
        name: "Meal Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        description: "Reminders for breakfast, lunch, and dinner",
        vibrationPattern: [0, 250, 250, 250],
      });

      await Notifications.setNotificationChannelAsync("water-reminders", {
        name: "Water Reminders",
        importance: Notifications.AndroidImportance.DEFAULT,
        description: "Reminders to drink water throughout the day",
      });
    }

    return true;
  }

  async loadSettings() {
    try {
      const stored = await AsyncStorage.getItem(
        STORAGE_KEYS.NOTIFICATION_SETTINGS,
      );
      this.settings = stored ? JSON.parse(stored) : this.defaultSettings;
    } catch (error) {
      console.error("Failed to load notification settings:", error);
      this.settings = this.defaultSettings;
    }
  }

  async saveSettings(newSettings) {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await AsyncStorage.setItem(
        STORAGE_KEYS.NOTIFICATION_SETTINGS,
        JSON.stringify(this.settings),
      );

      // Reschedule notifications with new settings
      await this.scheduleAllNotifications();
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    }
  }

  async scheduleAllNotifications() {
    await this.initialize();

    // Cancel all existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule meal reminders
    if (this.settings.breakfast_reminder) {
      await this.scheduleMealReminder(
        "breakfast",
        this.settings.breakfast_time,
      );
    }

    if (this.settings.lunch_reminder) {
      await this.scheduleMealReminder("lunch", this.settings.lunch_time);
    }

    if (this.settings.dinner_reminder) {
      await this.scheduleMealReminder("dinner", this.settings.dinner_time);
    }

    // Schedule water reminders
    if (this.settings.water_reminder) {
      await this.scheduleWaterReminders();
    }
  }

  async scheduleMealReminder(mealType, timeString) {
    try {
      const [hours, minutes] = timeString.split(":").map(Number);

      const trigger = {
        hour: hours,
        minute: minutes,
        repeats: true,
      };

      const content = {
        title: this.getMealReminderTitle(mealType),
        body: this.getMealReminderBody(mealType),
        data: { type: "meal_reminder", mealType },
        categoryIdentifier: "meal-reminders",
      };

      if (Platform.OS === "android") {
        content.android = {
          channelId: "meal-reminders",
          priority: "high",
          vibrationPattern: [0, 250, 250, 250],
        };
      }

      await Notifications.scheduleNotificationAsync({
        content,
        trigger,
        identifier: `meal_${mealType}`,
      });

      console.log(`Scheduled ${mealType} reminder for ${timeString}`);
    } catch (error) {
      console.error(`Failed to schedule ${mealType} reminder:`, error);
    }
  }

  async scheduleWaterReminders() {
    try {
      const intervalMs = this.settings.water_interval_hours * 60 * 60 * 1000;

      // Schedule water reminders every X hours during waking hours (7 AM - 10 PM)
      const wakingHours = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

      for (
        let i = 0;
        i < wakingHours.length;
        i += this.settings.water_interval_hours
      ) {
        const hour = wakingHours[i];

        const trigger = {
          hour,
          minute: 0,
          repeats: true,
        };

        const content = {
          title: "💧 Time to Hydrate!",
          body: "Don't forget to drink some water and stay hydrated.",
          data: { type: "water_reminder" },
          categoryIdentifier: "water-reminders",
        };

        if (Platform.OS === "android") {
          content.android = {
            channelId: "water-reminders",
            priority: "default",
          };
        }

        await Notifications.scheduleNotificationAsync({
          content,
          trigger,
          identifier: `water_${hour}`,
        });
      }

      console.log("Scheduled water reminders");
    } catch (error) {
      console.error("Failed to schedule water reminders:", error);
    }
  }

  getMealReminderTitle(mealType) {
    const titles = {
      breakfast: "🌅 Good Morning!",
      lunch: "🌞 Lunch Time!",
      dinner: "🌙 Dinner Time!",
    };
    return titles[mealType] || "Meal Reminder";
  }

  getMealReminderBody(mealType) {
    const bodies = {
      breakfast: "Start your day right with a nutritious breakfast!",
      lunch: "Time to refuel with a healthy lunch!",
      dinner: "End your day with a balanced dinner!",
    };
    return bodies[mealType] || "Time for your meal!";
  }

  async sendInstantNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error("Failed to send instant notification:", error);
    }
  }

  async cancelNotification(identifier) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error("Failed to cancel notification:", error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Failed to cancel all notifications:", error);
    }
  }

  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Failed to get scheduled notifications:", error);
      return [];
    }
  }

  // Notification response handlers
  setupNotificationResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      callback(data);
    });
  }

  setupNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data;
      callback(data, notification);
    });
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager();

// Convenience functions
export const initializeNotifications = () => notificationManager.initialize();
export const scheduleAllNotifications = () =>
  notificationManager.scheduleAllNotifications();
export const updateNotificationSettings = (settings) =>
  notificationManager.saveSettings(settings);
export const sendNotification = (title, body, data) =>
  notificationManager.sendInstantNotification(title, body, data);

export default notificationManager;
