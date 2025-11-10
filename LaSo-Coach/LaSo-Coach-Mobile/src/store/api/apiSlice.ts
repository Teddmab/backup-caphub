import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import CONFIG from '../../constants/config';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  DashboardData,
  MenuData,
  Challenge,
  Post,
  Conversation,
  Message,
  Notification,
  ApiResponse,
  OnboardingProgress,
  LeaderboardEntry,
  Badge,
} from '../../types';

// Base query with automatic token injection
const baseQuery = fetchBaseQuery({
  baseUrl: CONFIG.API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Base query with re-authentication on token expiry
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to get a new token using refresh token
    const refreshToken = (api.getState() as RootState).auth.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }, api, extraOptions);
      
      if (refreshResult.data) {
        // Store the new token
        api.dispatch({
          type: 'auth/refreshTokenSuccess',
          payload: refreshResult.data,
        });
        
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Menu', 'Challenge', 'Post', 'Message', 'Notification', 'Dashboard'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<ApiResponse<RegisterResponse>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    forgotPassword: builder.mutation<ApiResponse<{ message: string }>, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    resetPassword: builder.mutation<ApiResponse<{ message: string }>, {
      token: string;
      password: string;
    }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    verifyEmail: builder.mutation<ApiResponse<{ message: string }>, { token: string }>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    refreshToken: builder.mutation<ApiResponse<{
      token: string;
      refreshToken: string;
      expiresIn: number;
    }>, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),

    // User profile endpoints
    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (userData) => ({
        url: '/user/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    uploadAvatar: builder.mutation<ApiResponse<{ avatarUrl: string }>, FormData>({
      query: (formData) => ({
        url: '/user/avatar',
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type for FormData, let browser set it
        },
      }),
      invalidatesTags: ['User'],
    }),

    // Onboarding endpoints
    getOnboardingProgress: builder.query<ApiResponse<OnboardingProgress>, void>({
      query: () => '/onboarding/progress',
    }),
    
    updateOnboardingStep: builder.mutation<ApiResponse<OnboardingProgress>, {
      step: string;
      data: any;
    }>({
      query: ({ step, data }) => ({
        url: `/onboarding/${step}`,
        method: 'POST',
        body: data,
      }),
    }),
    
    completeOnboarding: builder.mutation<ApiResponse<{ success: boolean }>, void>({
      query: () => ({
        url: '/onboarding/complete',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Dashboard endpoints
    getDashboardData: builder.query<ApiResponse<DashboardData>, void>({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),

    // Menu endpoints
    getMenuByDate: builder.query<ApiResponse<MenuData>, string>({
      query: (date) => `/menus/${date}`,
      providesTags: ['Menu'],
    }),
    
    getMenuWeek: builder.query<ApiResponse<MenuData[]>, string>({
      query: (startDate) => `/menus/week/${startDate}`,
      providesTags: ['Menu'],
    }),
    
    rateMeal: builder.mutation<ApiResponse<{ success: boolean }>, {
      mealId: string;
      rating: number;
    }>({
      query: ({ mealId, rating }) => ({
        url: `/menus/rate/${mealId}`,
        method: 'POST',
        body: { rating },
      }),
      invalidatesTags: ['Menu'],
    }),
    
    toggleMealLike: builder.mutation<ApiResponse<{ liked: boolean }>, string>({
      query: (mealId) => ({
        url: `/menus/like/${mealId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Menu'],
    }),

    // Challenge endpoints
    getChallenges: builder.query<ApiResponse<Challenge[]>, {
      page?: number;
      category?: string;
      type?: string;
    }>({
      query: (params) => ({
        url: '/challenges',
        params,
      }),
      providesTags: ['Challenge'],
    }),
    
    getMyChallenges: builder.query<ApiResponse<Challenge[]>, void>({
      query: () => '/challenges/my',
      providesTags: ['Challenge'],
    }),
    
    assignChallenge: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (challengeId) => ({
        url: `/challenges/${challengeId}/assign`,
        method: 'POST',
      }),
      invalidatesTags: ['Challenge'],
    }),
    
    updateChallengeProgress: builder.mutation<ApiResponse<{ success: boolean }>, {
      challengeId: string;
      progress: number;
    }>({
      query: ({ challengeId, progress }) => ({
        url: `/challenges/${challengeId}/progress`,
        method: 'POST',
        body: { progress },
      }),
      invalidatesTags: ['Challenge'],
    }),
    
    getLeaderboard: builder.query<ApiResponse<LeaderboardEntry[]>, void>({
      query: () => '/challenges/leaderboard',
    }),
    
    getBadges: builder.query<ApiResponse<Badge[]>, void>({
      query: () => '/challenges/badges',
    }),

    // Community endpoints
    getPosts: builder.query<ApiResponse<Post[]>, {
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/community/posts',
        params,
      }),
      providesTags: ['Post'],
    }),
    
    createPost: builder.mutation<ApiResponse<Post>, FormData>({
      query: (postData) => ({
        url: '/community/posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),
    
    likePost: builder.mutation<ApiResponse<{ liked: boolean }>, string>({
      query: (postId) => ({
        url: `/community/posts/${postId}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Post'],
    }),
    
    commentOnPost: builder.mutation<ApiResponse<{ success: boolean }>, {
      postId: string;
      content: string;
    }>({
      query: ({ postId, content }) => ({
        url: `/community/posts/${postId}/comment`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Post'],
    }),

    // Chat endpoints
    getConversations: builder.query<ApiResponse<Conversation[]>, void>({
      query: () => '/chat/conversations',
      providesTags: ['Message'],
    }),
    
    getMessages: builder.query<ApiResponse<Message[]>, {
      conversationId: string;
      page?: number;
    }>({
      query: ({ conversationId, page = 1 }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        params: { page },
      }),
      providesTags: ['Message'],
    }),
    
    sendMessage: builder.mutation<ApiResponse<Message>, {
      conversationId: string;
      content: string;
      type?: string;
      attachments?: File[];
    }>({
      query: ({ conversationId, content, type = 'text', attachments }) => {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('type', type);
        
        if (attachments) {
          attachments.forEach((file, index) => {
            formData.append(`attachment_${index}`, file);
          });
        }
        
        return {
          url: `/chat/conversations/${conversationId}/messages`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Message'],
    }),
    
    markMessageAsRead: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (messageId) => ({
        url: `/chat/messages/${messageId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Message'],
    }),

    // Notification endpoints
    getNotifications: builder.query<ApiResponse<Notification[]>, {
      page?: number;
      unreadOnly?: boolean;
    }>({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      providesTags: ['Notification'],
    }),
    
    markNotificationAsRead: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    markAllNotificationsAsRead: builder.mutation<ApiResponse<{ success: boolean }>, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Progress tracking endpoints
    recordWeight: builder.mutation<ApiResponse<{ success: boolean }>, {
      weight: number;
      date: string;
    }>({
      query: (data) => ({
        url: '/progress/weight',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    
    recordMeasurements: builder.mutation<ApiResponse<{ success: boolean }>, {
      measurements: Record<string, number>;
      date: string;
    }>({
      query: (data) => ({
        url: '/progress/measurements',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Dashboard'],
    }),
    
    uploadProgressPhoto: builder.mutation<ApiResponse<{ success: boolean }>, FormData>({
      query: (formData) => ({
        url: '/progress/photo',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useRefreshTokenMutation,
  
  // User hooks
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  
  // Onboarding hooks
  useGetOnboardingProgressQuery,
  useUpdateOnboardingStepMutation,
  useCompleteOnboardingMutation,
  
  // Dashboard hooks
  useGetDashboardDataQuery,
  
  // Menu hooks
  useGetMenuByDateQuery,
  useGetMenuWeekQuery,
  useRateMealMutation,
  useToggleMealLikeMutation,
  
  // Challenge hooks
  useGetChallengesQuery,
  useGetMyChallengesQuery,
  useAssignChallengeMutation,
  useUpdateChallengeProgressMutation,
  useGetLeaderboardQuery,
  useGetBadgesQuery,
  
  // Community hooks
  useGetPostsQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useCommentOnPostMutation,
  
  // Chat hooks
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageAsReadMutation,
  
  // Notification hooks
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  
  // Progress hooks
  useRecordWeightMutation,
  useRecordMeasurementsMutation,
  useUploadProgressPhotoMutation,
} = api; 