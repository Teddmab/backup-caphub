export const CONFIG = {
  // API Configuration
  API_BASE_URL: __DEV__ 
    ? 'http://localhost:5001/api/v1'
    : 'https://laso-coach-backend.onrender.com/api/v1',
  
  WS_URL: __DEV__
    ? 'ws://localhost:5001'
    : 'wss://laso-coach-backend.onrender.com',
  
  // App Configuration
  APP_NAME: 'LaSo Coach',
  APP_VERSION: '1.0.0',
  BUNDLE_ID: 'com.laso.coach',
  
  // Authentication
  TOKEN_STORAGE_KEY: '@laso_auth_token',
  USER_STORAGE_KEY: '@laso_user_data',
  BIOMETRIC_STORAGE_KEY: '@laso_biometric_enabled',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Media
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'mov', 'avi'],
  
  // Cache
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  IMAGE_CACHE_SIZE: 100,
  
  // Notifications
  NOTIFICATION_TYPES: {
    MESSAGE: 'message',
    CHALLENGE: 'challenge',
    MEAL_REMINDER: 'meal_reminder',
    PROGRESS_UPDATE: 'progress_update',
    COMMUNITY_INTERACTION: 'community_interaction',
    SUBSCRIPTION: 'subscription',
  } as const,
  
  // Timeouts
  API_TIMEOUT: 30000, // 30 seconds
  IMAGE_UPLOAD_TIMEOUT: 60000, // 1 minute
  
  // Feature Flags
  FEATURES: {
    BIOMETRIC_AUTH: true,
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    DARK_MODE: false,
    BETA_FEATURES: __DEV__,
  },
  
  // Limits
  MAX_MESSAGE_LENGTH: 1000,
  MAX_POST_LENGTH: 2000,
  MAX_USERNAME_LENGTH: 30,
  MIN_PASSWORD_LENGTH: 8,
  
  // Onboarding
  ONBOARDING_STEPS: [
    'welcome',
    'profile',
    'goals',
    'recommendations',
    'rendezvous',
    'subscription',
    'success'
  ] as const,
  
  // Social
  FACEBOOK_APP_ID: process.env.REACT_NATIVE_FACEBOOK_APP_ID || '',
  
  // Payment
  STRIPE_PUBLISHABLE_KEY: process.env.REACT_NATIVE_STRIPE_KEY || '',
  
  // Analytics
  SENTRY_DSN: process.env.REACT_NATIVE_SENTRY_DSN || '',
  
  // Deep Linking
  DEEP_LINK_PREFIX: 'laso-coach://',
  
  // Regional Settings
  DEFAULT_LANGUAGE: 'fr',
  SUPPORTED_LANGUAGES: ['fr', 'en'],
  DEFAULT_CURRENCY: 'EUR',
  DEFAULT_TIMEZONE: 'Europe/Paris',
};

// Environment-specific overrides
if (__DEV__) {
  // Development settings
  Object.assign(CONFIG, {
    API_TIMEOUT: 60000, // Longer timeout for debugging
    CACHE_DURATION: 1000, // Shorter cache for development
  });
}

export default CONFIG; 