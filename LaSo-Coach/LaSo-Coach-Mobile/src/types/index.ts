// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: Address;
  preferences: UserPreferences;
  subscription?: Subscription;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UserPreferences {
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  notifications: NotificationSettings;
  dietary: DietaryPreferences;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  mealReminders: boolean;
  challengeUpdates: boolean;
  communityInteractions: boolean;
  marketingMessages: boolean;
}

export interface DietaryPreferences {
  allergies: string[];
  dislikes: string[];
  healthConditions: string[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: string[];
  targetWeight?: number;
  currentWeight?: number;
  height?: number;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showProgress: boolean;
  showActivity: boolean;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
  biometric?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface RegisterResponse {
  token: string;
  user: User;
  emailVerificationRequired: boolean;
}

// Onboarding Types
export interface OnboardingStep {
  id: string;
  name: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
}

export interface OnboardingProgress {
  currentStep: string;
  completedSteps: string[];
  totalSteps: number;
  completedCount: number;
  progress: number;
}

// Dashboard Types
export interface DashboardData {
  welcome: WelcomeData;
  progress: ProgressData;
  menuToday: MenuData;
  news: NewsItem[];
  communityPosts: Post[];
  quickActions: QuickAction[];
}

export interface WelcomeData {
  greeting: string;
  motivationMessage: string;
  streakDays: number;
  nextMeal?: {
    type: string;
    timeUntil: number;
  };
}

export interface ProgressData {
  currentPhase: string;
  daysSinceStart: number;
  weightLoss: number;
  achievedGoals: number;
  totalGoals: number;
  chartData: ChartDataPoint[];
  milestones: Milestone[];
}

export interface ChartDataPoint {
  date: string;
  weight: number;
  measurements?: {
    waist?: number;
    hips?: number;
    chest?: number;
    arms?: number;
  };
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: string;
  targetDate?: string;
  reward?: string;
}

// Menu Types
export interface MenuData {
  date: string;
  phase: string;
  meals: Meal[];
  nutritionSummary: NutritionSummary;
  shopppingList?: ShoppingItem[];
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  image?: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionFacts: NutritionFacts;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  liked?: boolean;
  rating?: number;
  alternatives?: MealAlternative[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  optional?: boolean;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface NutritionSummary {
  targetCalories: number;
  consumedCalories: number;
  targetProtein: number;
  consumedProtein: number;
  targetCarbs: number;
  consumedCarbs: number;
  targetFat: number;
  consumedFat: number;
}

export interface MealAlternative {
  id: string;
  name: string;
  reason: string;
  swapType: 'ingredient' | 'meal';
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
}

// Challenge Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'milestone';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  badge?: Badge;
  startDate: string;
  endDate?: string;
  assigned: boolean;
  completed: boolean;
  completedDate?: string;
  progress: number;
  requirements: ChallengeRequirement[];
  participants: number;
  image?: string;
}

export interface ChallengeRequirement {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  points: number;
  badges: number;
  streak: number;
}

// Community Types
export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  images?: string[];
  video?: string;
  type: 'text' | 'image' | 'video' | 'achievement' | 'recipe';
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  bookmarked: boolean;
  createdAt: string;
  updatedAt: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
  createdAt: string;
}

// Chat Types
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  online: boolean;
  lastSeen?: string;
  role?: 'coach' | 'member' | 'admin';
}

export interface Message {
  id: string;
  conversationId: string;
  sender: ChatUser;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'system';
  attachments?: Attachment[];
  replyTo?: Message;
  reactions?: Reaction[];
  status: 'sending' | 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  thumbnail?: string;
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'message' | 'challenge' | 'meal_reminder' | 'progress_update' | 'community_interaction' | 'subscription';
  title: string;
  body: string;
  data?: any;
  read: boolean;
  actionUrl?: string;
  image?: string;
  createdAt: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate?: string;
  renewalDate?: string;
  paymentMethod?: PaymentMethod;
  amount: number;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  currency: string;
  interval: 'month' | 'year';
  trialDays?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  pagination?: PaginationMeta;
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  Profile: undefined;
  Goals: undefined;
  Recommendations: undefined;
  Rendezvous: undefined;
  Subscription: undefined;
  Success: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Progress: undefined;
  Menus: undefined;
  Challenges: undefined;
  More: undefined;
};

export type MoreStackParamList = {
  MoreHome: undefined;
  Notifications: undefined;
  Community: undefined;
  Chat: undefined;
  Agenda: undefined;
  Settings: undefined;
  Profile: undefined;
};

// Utility Types
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  action: string;
  params?: any;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'fr' | 'en';
  notifications: boolean;
  biometric: boolean;
  autoSync: boolean;
  dataUsage: 'wifi_only' | 'always';
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'multiselect' | 'date' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

// Event Types
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: number;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
}

export default {}; 