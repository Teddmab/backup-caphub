import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationSettings } from '../../types';

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
  pushToken: string | null;
  permissionGranted: boolean;
  lastChecked: number | null;
  filters: {
    type: string | null;
    read: boolean | null;
  };
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  settings: {
    pushEnabled: true,
    emailEnabled: true,
    mealReminders: true,
    challengeUpdates: true,
    communityInteractions: true,
    marketingMessages: false,
  },
  isLoading: false,
  error: null,
  pushToken: null,
  permissionGranted: false,
  lastChecked: null,
  filters: {
    type: null,
    read: null,
  },
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
      state.lastChecked = Date.now();
      state.isLoading = false;
    },
    
    addNotification: (state, action: PayloadAction<Notification>) => {
      const notification = action.payload;
      
      // Check if notification already exists
      if (!state.items.find(n => n.id === notification.id)) {
        state.items.unshift(notification);
        
        if (!notification.read) {
          state.unreadCount += 1;
        }
      }
    },
    
    updateNotification: (state, action: PayloadAction<Partial<Notification> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const notification = state.items.find(n => n.id === id);
      
      if (notification) {
        const wasUnread = !notification.read;
        Object.assign(notification, updates);
        
        // Update unread count if read status changed
        if (wasUnread && notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (!wasUnread && !notification.read) {
          state.unreadCount += 1;
        }
      }
    },
    
    markAsRead: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notification = state.items.find(n => n.id === notificationId);
      
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    markAllAsRead: (state) => {
      state.items.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    
    markAsUnread: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notification = state.items.find(n => n.id === notificationId);
      
      if (notification && notification.read) {
        notification.read = false;
        state.unreadCount += 1;
      }
    },
    
    deleteNotification: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      const notificationIndex = state.items.findIndex(n => n.id === notificationId);
      
      if (notificationIndex >= 0) {
        const notification = state.items[notificationIndex];
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items.splice(notificationIndex, 1);
      }
    },
    
    clearAllNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    
    updateSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    setPushToken: (state, action: PayloadAction<string>) => {
      state.pushToken = action.payload;
    },
    
    setPermissionGranted: (state, action: PayloadAction<boolean>) => {
      state.permissionGranted = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        type: null,
        read: null,
      };
    },
    
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, action.payload);
    },
    
    handlePushNotification: (state, action: PayloadAction<{
      notification: Notification;
      inForeground: boolean;
    }>) => {
      const { notification, inForeground } = action.payload;
      
      // Add notification to list
      if (!state.items.find(n => n.id === notification.id)) {
        state.items.unshift(notification);
      }
      
      // Update unread count if app is in foreground
      if (inForeground && !notification.read) {
        state.unreadCount += 1;
      }
    },
    
    setLastChecked: (state, action: PayloadAction<number>) => {
      state.lastChecked = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetNotifications: (state) => {
      return {
        ...initialState,
        settings: state.settings, // Keep settings
        pushToken: state.pushToken, // Keep push token
        permissionGranted: state.permissionGranted, // Keep permission status
      };
    },
  },
});

export const {
  setLoading,
  setNotifications,
  addNotification,
  updateNotification,
  markAsRead,
  markAllAsRead,
  markAsUnread,
  deleteNotification,
  clearAllNotifications,
  updateSettings,
  setPushToken,
  setPermissionGranted,
  setFilters,
  clearFilters,
  incrementUnreadCount,
  decrementUnreadCount,
  setUnreadCount,
  handlePushNotification,
  setLastChecked,
  setError,
  clearError,
  resetNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

// Selectors
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications;
export const selectNotificationItems = (state: { notifications: NotificationsState }) => state.notifications.items;
export const selectUnreadCount = (state: { notifications: NotificationsState }) => state.notifications.unreadCount;
export const selectNotificationSettings = (state: { notifications: NotificationsState }) => state.notifications.settings;
export const selectPushToken = (state: { notifications: NotificationsState }) => state.notifications.pushToken;
export const selectPermissionGranted = (state: { notifications: NotificationsState }) => state.notifications.permissionGranted;
export const selectNotificationFilters = (state: { notifications: NotificationsState }) => state.notifications.filters;

// Filtered selectors
export const selectFilteredNotifications = (state: { notifications: NotificationsState }) => {
  const { items, filters } = state.notifications;
  
  return items.filter(notification => {
    if (filters.type && notification.type !== filters.type) {
      return false;
    }
    
    if (filters.read !== null && notification.read !== filters.read) {
      return false;
    }
    
    return true;
  });
};

export const selectUnreadNotifications = (state: { notifications: NotificationsState }) => {
  return state.notifications.items.filter(n => !n.read);
}; 