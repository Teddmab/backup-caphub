import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Challenge, Badge, LeaderboardEntry } from '../../types';

interface ChallengesState {
  available: Challenge[];
  assigned: Challenge[];
  completed: Challenge[];
  leaderboard: LeaderboardEntry[];
  badges: Badge[];
  userStats: {
    totalPoints: number;
    completedChallenges: number;
    currentStreak: number;
    rank: number;
    badgeCount: number;
  };
  filters: {
    category: string | null;
    difficulty: string | null;
    type: string | null;
  };
  isLoading: boolean;
  error: string | null;
  refreshing: boolean;
}

const initialState: ChallengesState = {
  available: [],
  assigned: [],
  completed: [],
  leaderboard: [],
  badges: [],
  userStats: {
    totalPoints: 0,
    completedChallenges: 0,
    currentStreak: 0,
    rank: 0,
    badgeCount: 0,
  },
  filters: {
    category: null,
    difficulty: null,
    type: null,
  },
  isLoading: false,
  error: null,
  refreshing: false,
};

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    
    setAvailableChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.available = action.payload;
    },
    
    setAssignedChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.assigned = action.payload;
    },
    
    setCompletedChallenges: (state, action: PayloadAction<Challenge[]>) => {
      state.completed = action.payload;
    },
    
    setLeaderboard: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.leaderboard = action.payload;
    },
    
    setBadges: (state, action: PayloadAction<Badge[]>) => {
      state.badges = action.payload;
    },
    
    assignChallenge: (state, action: PayloadAction<string>) => {
      const challengeId = action.payload;
      const challenge = state.available.find(c => c.id === challengeId);
      
      if (challenge) {
        // Move from available to assigned
        state.available = state.available.filter(c => c.id !== challengeId);
        state.assigned.push({ ...challenge, assigned: true });
      }
    },
    
    updateChallengeProgress: (state, action: PayloadAction<{
      challengeId: string;
      progress: number;
    }>) => {
      const { challengeId, progress } = action.payload;
      const challenge = state.assigned.find(c => c.id === challengeId);
      
      if (challenge) {
        challenge.progress = progress;
        
        // Check if challenge is completed
        if (progress >= 100 && !challenge.completed) {
          challenge.completed = true;
          challenge.completedDate = new Date().toISOString();
          
          // Move to completed list
          state.assigned = state.assigned.filter(c => c.id !== challengeId);
          state.completed.unshift(challenge);
          
          // Update user stats
          state.userStats.completedChallenges += 1;
          state.userStats.totalPoints += challenge.points;
        }
      }
    },
    
    completeChallenge: (state, action: PayloadAction<{
      challengeId: string;
      earnedBadge?: Badge;
    }>) => {
      const { challengeId, earnedBadge } = action.payload;
      const challenge = state.assigned.find(c => c.id === challengeId);
      
      if (challenge) {
        challenge.completed = true;
        challenge.completedDate = new Date().toISOString();
        challenge.progress = 100;
        
        // Move to completed
        state.assigned = state.assigned.filter(c => c.id !== challengeId);
        state.completed.unshift(challenge);
        
        // Update stats
        state.userStats.completedChallenges += 1;
        state.userStats.totalPoints += challenge.points;
        
        // Add badge if earned
        if (earnedBadge) {
          state.badges.push(earnedBadge);
          state.userStats.badgeCount += 1;
        }
      }
    },
    
    updateUserStats: (state, action: PayloadAction<Partial<typeof initialState.userStats>>) => {
      state.userStats = { ...state.userStats, ...action.payload };
    },
    
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: null,
        difficulty: null,
        type: null,
      };
    },
    
    addBadge: (state, action: PayloadAction<Badge>) => {
      const badge = action.payload;
      if (!state.badges.find(b => b.id === badge.id)) {
        state.badges.push(badge);
        state.userStats.badgeCount += 1;
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
    
    resetChallenges: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setRefreshing,
  setAvailableChallenges,
  setAssignedChallenges,
  setCompletedChallenges,
  setLeaderboard,
  setBadges,
  assignChallenge,
  updateChallengeProgress,
  completeChallenge,
  updateUserStats,
  setFilters,
  clearFilters,
  addBadge,
  setError,
  clearError,
  resetChallenges,
} = challengesSlice.actions;

export default challengesSlice.reducer;

// Selectors
export const selectChallenges = (state: { challenges: ChallengesState }) => state.challenges;
export const selectAvailableChallenges = (state: { challenges: ChallengesState }) => state.challenges.available;
export const selectAssignedChallenges = (state: { challenges: ChallengesState }) => state.challenges.assigned;
export const selectCompletedChallenges = (state: { challenges: ChallengesState }) => state.challenges.completed;
export const selectLeaderboard = (state: { challenges: ChallengesState }) => state.challenges.leaderboard;
export const selectBadges = (state: { challenges: ChallengesState }) => state.challenges.badges;
export const selectUserStats = (state: { challenges: ChallengesState }) => state.challenges.userStats;
export const selectChallengeFilters = (state: { challenges: ChallengesState }) => state.challenges.filters; 