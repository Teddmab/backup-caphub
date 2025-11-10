import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '../../types';

interface AppState {
  isOnline: boolean;
  lastSyncTime: number | null;
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  settings: AppSettings;
  isFirstLaunch: boolean;
  appVersion: string;
  buildNumber: string;
  isLoading: boolean;
  error: string | null;
  deepLinkUrl: string | null;
  tabBadges: Record<string, number>;
  activeTab: string;
}

const initialState: AppState = {
  isOnline: true,
  lastSyncTime: null,
  theme: 'light',
  language: 'fr',
  settings: {
    theme: 'light',
    language: 'fr',
    notifications: true,
    biometric: false,
    autoSync: true,
    dataUsage: 'wifi_only',
  },
  isFirstLaunch: true,
  appVersion: '1.0.0',
  buildNumber: '1',
  isLoading: false,
  error: null,
  deepLinkUrl: null,
  tabBadges: {
    notifications: 0,
    challenges: 0,
    messages: 0,
  },
  activeTab: 'Dashboard',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
      if (action.payload) {
        state.lastSyncTime = Date.now();
      }
    },
    
    setLastSyncTime: (state, action: PayloadAction<number>) => {
      state.lastSyncTime = action.payload;
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      state.settings.theme = action.payload;
    },
    
    setLanguage: (state, action: PayloadAction<'fr' | 'en'>) => {
      state.language = action.payload;
      state.settings.language = action.payload;
    },
    
    updateSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      
      // Update top-level state if theme or language changed
      if (action.payload.theme) {
        state.theme = action.payload.theme;
      }
      if (action.payload.language) {
        state.language = action.payload.language;
      }
    },
    
    setFirstLaunch: (state, action: PayloadAction<boolean>) => {
      state.isFirstLaunch = action.payload;
    },
    
    setAppVersion: (state, action: PayloadAction<{
      version: string;
      buildNumber: string;
    }>) => {
      state.appVersion = action.payload.version;
      state.buildNumber = action.payload.buildNumber;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setDeepLinkUrl: (state, action: PayloadAction<string | null>) => {
      state.deepLinkUrl = action.payload;
    },
    
    clearDeepLinkUrl: (state) => {
      state.deepLinkUrl = null;
    },
    
    updateTabBadge: (state, action: PayloadAction<{
      tab: string;
      count: number;
    }>) => {
      const { tab, count } = action.payload;
      state.tabBadges[tab] = count;
    },
    
    clearTabBadge: (state, action: PayloadAction<string>) => {
      state.tabBadges[action.payload] = 0;
    },
    
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    
    incrementTabBadge: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      state.tabBadges[tab] = (state.tabBadges[tab] || 0) + 1;
    },
    
    decrementTabBadge: (state, action: PayloadAction<string>) => {
      const tab = action.payload;
      if (state.tabBadges[tab] > 0) {
        state.tabBadges[tab] -= 1;
      }
    },
    
    syncStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    syncSuccess: (state) => {
      state.isLoading = false;
      state.lastSyncTime = Date.now();
      state.error = null;
    },
    
    syncFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    resetApp: (state) => {
      return {
        ...initialState,
        isFirstLaunch: false, // Keep this as false after reset
      };
    },
  },
});

export const {
  setOnlineStatus,
  setLastSyncTime,
  setTheme,
  setLanguage,
  updateSettings,
  setFirstLaunch,
  setAppVersion,
  setLoading,
  setError,
  clearError,
  setDeepLinkUrl,
  clearDeepLinkUrl,
  updateTabBadge,
  clearTabBadge,
  setActiveTab,
  incrementTabBadge,
  decrementTabBadge,
  syncStart,
  syncSuccess,
  syncFailure,
  resetApp,
} = appSlice.actions;

export default appSlice.reducer;

// Selectors
export const selectApp = (state: { app: AppState }) => state.app;
export const selectIsOnline = (state: { app: AppState }) => state.app.isOnline;
export const selectTheme = (state: { app: AppState }) => state.app.theme;
export const selectLanguage = (state: { app: AppState }) => state.app.language;
export const selectSettings = (state: { app: AppState }) => state.app.settings;
export const selectIsFirstLaunch = (state: { app: AppState }) => state.app.isFirstLaunch;
export const selectTabBadges = (state: { app: AppState }) => state.app.tabBadges;
export const selectActiveTab = (state: { app: AppState }) => state.app.activeTab;
export const selectDeepLinkUrl = (state: { app: AppState }) => state.app.deepLinkUrl; 