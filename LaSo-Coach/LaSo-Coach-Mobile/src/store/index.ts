import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Import slices
import authSlice from './slices/authSlice';
import onboardingSlice from './slices/onboardingSlice';
import dashboardSlice from './slices/dashboardSlice';
import challengesSlice from './slices/challengesSlice';
import chatSlice from './slices/chatSlice';
import communitySlice from './slices/communitySlice';
import notificationsSlice from './slices/notificationsSlice';
import appSlice from './slices/appSlice';

// Import API
import { api } from './api/apiSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'app', 'onboarding'], // Only persist these slices
  blacklist: ['api'], // Don't persist API cache
};

// Auth persist config - store tokens securely
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'refreshToken', 'user', 'isAuthenticated', 'biometricEnabled'],
};

// Root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  onboarding: onboardingSlice,
  dashboard: dashboardSlice,
  challenges: challengesSlice,
  chat: chatSlice,
  community: communitySlice,
  notifications: notificationsSlice,
  app: appSlice,
  api: api.reducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
  devTools: __DEV__,
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store; 