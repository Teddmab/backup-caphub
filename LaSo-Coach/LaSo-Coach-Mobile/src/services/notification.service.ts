import PushNotification from 'react-native-push-notification';
import { Platform, PermissionsAndroid } from 'react-native';
import CONFIG from '../constants/config';
import { Notification } from '../types';

class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | null = null;
  private isInitialized = false;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Configure push notifications
      PushNotification.configure({
        // Called when token is generated
        onRegister: (token) => {
          console.log('Push token received:', token.token);
          this.pushToken = token.token;
          // TODO: Send token to backend
        },

        // Called when a remote notification is received
        onNotification: (notification) => {
          console.log('Notification received:', notification);
          this.handleNotification(notification);
        },

        // Called when a remote notification is opened by user
        onAction: (notification) => {
          console.log('Notification action:', notification);
          this.handleNotificationAction(notification);
        },

        // Called when the user fails to register for remote notifications
        onRegistrationError: (error) => {
          console.error('Push notification registration error:', error);
        },

        // Should the initial notification be popped automatically
        popInitialNotification: true,

        // Request permissions on iOS
        requestPermissions: Platform.OS === 'ios',
      });

      // Request notification permissions for Android
      if (Platform.OS === 'android') {
        await this.requestAndroidPermissions();
      }

      // Create notification channels for Android
      this.createNotificationChannels();

      this.isInitialized = true;
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Error initializing notification service:', error);
      throw error;
    }
  }

  private async requestAndroidPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting Android notification permissions:', error);
      return false;
    }
  }

  private createNotificationChannels(): void {
    if (Platform.OS !== 'android') return;

    // Create channels for different notification types
    PushNotification.createChannel(
      {
        channelId: 'default',
        channelName: 'Default Notifications',
        channelDescription: 'Default notification channel',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log('Default channel created:', created)
    );

    PushNotification.createChannel(
      {
        channelId: 'meal-reminders',
        channelName: 'Meal Reminders',
        channelDescription: 'Notifications for meal times',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log('Meal reminders channel created:', created)
    );

    PushNotification.createChannel(
      {
        channelId: 'challenges',
        channelName: 'Challenges',
        channelDescription: 'Challenge updates and completions',
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      (created) => console.log('Challenges channel created:', created)
    );

    PushNotification.createChannel(
      {
        channelId: 'messages',
        channelName: 'Messages',
        channelDescription: 'New messages from coaches and community',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log('Messages channel created:', created)
    );
  }

  private handleNotification(notification: any): void {
    // Handle notification based on type
    const notificationType = notification.data?.type || 'default';
    
    switch (notificationType) {
      case CONFIG.NOTIFICATION_TYPES.MESSAGE:
        this.handleMessageNotification(notification);
        break;
      case CONFIG.NOTIFICATION_TYPES.CHALLENGE:
        this.handleChallengeNotification(notification);
        break;
      case CONFIG.NOTIFICATION_TYPES.MEAL_REMINDER:
        this.handleMealReminderNotification(notification);
        break;
      default:
        console.log('Unhandled notification type:', notificationType);
    }
  }

  private handleNotificationAction(notification: any): void {
    // Handle notification tap/action
    const actionUrl = notification.data?.actionUrl;
    
    if (actionUrl) {
      // TODO: Navigate to specific screen based on actionUrl
      console.log('Navigate to:', actionUrl);
    }
  }

  private handleMessageNotification(notification: any): void {
    // Handle new message notification
    console.log('New message notification:', notification);
    // TODO: Update chat state, increment badge count
  }

  private handleChallengeNotification(notification: any): void {
    // Handle challenge notification
    console.log('Challenge notification:', notification);
    // TODO: Update challenges state, show completion animation
  }

  private handleMealReminderNotification(notification: any): void {
    // Handle meal reminder notification
    console.log('Meal reminder notification:', notification);
    // TODO: Navigate to menu screen
  }

  // Show local notification
  showLocalNotification(notification: {
    title: string;
    message: string;
    data?: any;
    channelId?: string;
    scheduleDate?: Date;
  }): void {
    const { title, message, data = {}, channelId = 'default', scheduleDate } = notification;

    PushNotification.localNotification({
      title,
      message,
      data,
      channelId,
      date: scheduleDate,
      allowWhileIdle: true,
    });
  }

  // Schedule recurring meal reminders
  scheduleMealReminders(mealTimes: { type: string; time: string }[]): void {
    // Cancel existing meal reminders
    this.cancelMealReminders();

    mealTimes.forEach((meal, index) => {
      const [hour, minute] = meal.time.split(':').map(Number);
      const scheduleDate = new Date();
      scheduleDate.setHours(hour, minute, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduleDate.getTime() <= Date.now()) {
        scheduleDate.setDate(scheduleDate.getDate() + 1);
      }

      PushNotification.localNotificationSchedule({
        id: `meal-${index}`,
        title: `Temps de ${meal.type}!`,
        message: `Il est temps de prendre votre ${meal.type}. Bon appétit!`,
        date: scheduleDate,
        repeatType: 'day',
        channelId: 'meal-reminders',
        data: {
          type: CONFIG.NOTIFICATION_TYPES.MEAL_REMINDER,
          mealType: meal.type,
        },
      });
    });
  }

  private cancelMealReminders(): void {
    // Cancel all scheduled meal reminders
    for (let i = 0; i < 10; i++) {
      PushNotification.cancelLocalNotifications({ id: `meal-${i}` });
    }
  }

  // Schedule challenge reminder
  scheduleChallengeReminder(challengeId: string, title: string, time: Date): void {
    PushNotification.localNotificationSchedule({
      id: `challenge-${challengeId}`,
      title: 'Défi en cours!',
      message: title,
      date: time,
      channelId: 'challenges',
      data: {
        type: CONFIG.NOTIFICATION_TYPES.CHALLENGE,
        challengeId,
      },
    });
  }

  // Cancel specific notification
  cancelNotification(id: string): void {
    PushNotification.cancelLocalNotifications({ id });
  }

  // Cancel all notifications
  cancelAllNotifications(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  // Get notification permissions status
  async getPermissionStatus(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions.alert && permissions.badge && permissions.sound);
      });
    });
  }

  // Request notification permissions
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions()
        .then((permissions) => {
          resolve(permissions.alert && permissions.badge && permissions.sound);
        })
        .catch(() => resolve(false));
    });
  }

  // Get push token
  getPushToken(): string | null {
    return this.pushToken;
  }

  // Set badge count
  setBadgeCount(count: number): void {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  // Clear badge count
  clearBadgeCount(): void {
    PushNotification.setApplicationIconBadgeNumber(0);
  }
}

export default NotificationService.getInstance(); 