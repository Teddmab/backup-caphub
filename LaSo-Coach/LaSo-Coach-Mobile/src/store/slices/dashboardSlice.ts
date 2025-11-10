import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardData, ProgressData, MenuData, NewsItem, Post, QuickAction } from '../../types';

interface DashboardState {
  welcomeData: {
    greeting: string;
    motivationMessage: string;
    streakDays: number;
    nextMeal?: {
      type: string;
      timeUntil: number;
    };
  } | null;
  progressData: ProgressData | null;
  menuToday: MenuData | null;
  newsItems: NewsItem[];
  communityPosts: Post[];
  quickActions: QuickAction[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  refreshing: boolean;
}

const initialState: DashboardState = {
  welcomeData: null,
  progressData: null,
  menuToday: null,
  newsItems: [],
  communityPosts: [],
  quickActions: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  refreshing: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    
    setDashboardData: (state, action: PayloadAction<DashboardData>) => {
      const { welcome, progress, menuToday, news, communityPosts, quickActions } = action.payload;
      state.welcomeData = welcome;
      state.progressData = progress;
      state.menuToday = menuToday;
      state.newsItems = news;
      state.communityPosts = communityPosts;
      state.quickActions = quickActions;
      state.lastUpdated = Date.now();
      state.isLoading = false;
      state.refreshing = false;
      state.error = null;
    },
    
    updateProgress: (state, action: PayloadAction<Partial<ProgressData>>) => {
      if (state.progressData) {
        state.progressData = { ...state.progressData, ...action.payload };
      }
    },
    
    updateMenuToday: (state, action: PayloadAction<MenuData>) => {
      state.menuToday = action.payload;
    },
    
    addNewsItem: (state, action: PayloadAction<NewsItem>) => {
      state.newsItems.unshift(action.payload);
    },
    
    updateNewsItems: (state, action: PayloadAction<NewsItem[]>) => {
      state.newsItems = action.payload;
    },
    
    addCommunityPost: (state, action: PayloadAction<Post>) => {
      state.communityPosts.unshift(action.payload);
    },
    
    updateCommunityPosts: (state, action: PayloadAction<Post[]>) => {
      state.communityPosts = action.payload;
    },
    
    updatePostLike: (state, action: PayloadAction<{
      postId: string;
      liked: boolean;
      likesCount: number;
    }>) => {
      const { postId, liked, likesCount } = action.payload;
      const post = state.communityPosts.find(p => p.id === postId);
      if (post) {
        post.liked = liked;
        post.likes = likesCount;
      }
    },
    
    incrementStreak: (state) => {
      if (state.welcomeData) {
        state.welcomeData.streakDays += 1;
      }
    },
    
    updateNextMeal: (state, action: PayloadAction<{
      type: string;
      timeUntil: number;
    } | undefined>) => {
      if (state.welcomeData) {
        state.welcomeData.nextMeal = action.payload;
      }
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.refreshing = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    refreshDashboard: (state) => {
      state.refreshing = true;
      state.error = null;
    },
    
    resetDashboard: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setRefreshing,
  setDashboardData,
  updateProgress,
  updateMenuToday,
  addNewsItem,
  updateNewsItems,
  addCommunityPost,
  updateCommunityPosts,
  updatePostLike,
  incrementStreak,
  updateNextMeal,
  setError,
  clearError,
  refreshDashboard,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

// Selectors
export const selectDashboard = (state: { dashboard: DashboardState }) => state.dashboard;
export const selectWelcomeData = (state: { dashboard: DashboardState }) => state.dashboard.welcomeData;
export const selectProgressData = (state: { dashboard: DashboardState }) => state.dashboard.progressData;
export const selectMenuToday = (state: { dashboard: DashboardState }) => state.dashboard.menuToday;
export const selectNewsItems = (state: { dashboard: DashboardState }) => state.dashboard.newsItems;
export const selectCommunityPosts = (state: { dashboard: DashboardState }) => state.dashboard.communityPosts;
export const selectQuickActions = (state: { dashboard: DashboardState }) => state.dashboard.quickActions;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.isLoading;
export const selectDashboardRefreshing = (state: { dashboard: DashboardState }) => state.dashboard.refreshing; 