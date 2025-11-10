import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, Comment } from '../../types';

interface CommunityState {
  posts: Post[];
  myPosts: Post[];
  likedPosts: Set<string>;
  bookmarkedPosts: Set<string>;
  following: Set<string>;
  followers: Set<string>;
  postComments: Record<string, Comment[]>;
  currentFilter: 'all' | 'following' | 'trending' | 'recent';
  isLoading: boolean;
  isPosting: boolean;
  error: string | null;
  refreshing: boolean;
  hasMore: boolean;
  page: number;
}

const initialState: CommunityState = {
  posts: [],
  myPosts: [],
  likedPosts: new Set(),
  bookmarkedPosts: new Set(),
  following: new Set(),
  followers: new Set(),
  postComments: {},
  currentFilter: 'all',
  isLoading: false,
  isPosting: false,
  error: null,
  refreshing: false,
  hasMore: true,
  page: 1,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setPosting: (state, action: PayloadAction<boolean>) => {
      state.isPosting = action.payload;
    },
    
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    
    setPosts: (state, action: PayloadAction<{
      posts: Post[];
      append?: boolean;
      reset?: boolean;
    }>) => {
      const { posts, append = false, reset = false } = action.payload;
      
      if (reset || !append) {
        state.posts = posts;
        state.page = 2; // Next page to load
        state.hasMore = posts.length > 0;
      } else {
        // Filter out duplicates when appending
        const existingIds = new Set(state.posts.map(p => p.id));
        const newPosts = posts.filter(p => !existingIds.has(p.id));
        state.posts.push(...newPosts);
        state.page += 1;
        state.hasMore = newPosts.length > 0;
      }
      
      state.isLoading = false;
      state.refreshing = false;
    },
    
    setMyPosts: (state, action: PayloadAction<Post[]>) => {
      state.myPosts = action.payload;
    },
    
    addPost: (state, action: PayloadAction<Post>) => {
      const post = action.payload;
      
      // Add to beginning of posts array
      state.posts.unshift(post);
      
      // Add to my posts if it's the user's post
      state.myPosts.unshift(post);
      
      state.isPosting = false;
    },
    
    updatePost: (state, action: PayloadAction<Partial<Post> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      
      // Update in posts array
      const postIndex = state.posts.findIndex(p => p.id === id);
      if (postIndex >= 0) {
        Object.assign(state.posts[postIndex], updates);
      }
      
      // Update in my posts array
      const myPostIndex = state.myPosts.findIndex(p => p.id === id);
      if (myPostIndex >= 0) {
        Object.assign(state.myPosts[myPostIndex], updates);
      }
    },
    
    deletePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      
      state.posts = state.posts.filter(p => p.id !== postId);
      state.myPosts = state.myPosts.filter(p => p.id !== postId);
      
      // Remove from liked/bookmarked
      state.likedPosts.delete(postId);
      state.bookmarkedPosts.delete(postId);
    },
    
    likePost: (state, action: PayloadAction<{
      postId: string;
      liked: boolean;
      likesCount: number;
    }>) => {
      const { postId, liked, likesCount } = action.payload;
      
      // Update post like status
      const updatePostLike = (post: Post) => {
        if (post.id === postId) {
          post.liked = liked;
          post.likes = likesCount;
        }
      };
      
      state.posts.forEach(updatePostLike);
      state.myPosts.forEach(updatePostLike);
      
      // Update liked posts set
      if (liked) {
        state.likedPosts.add(postId);
      } else {
        state.likedPosts.delete(postId);
      }
    },
    
    bookmarkPost: (state, action: PayloadAction<{
      postId: string;
      bookmarked: boolean;
    }>) => {
      const { postId, bookmarked } = action.payload;
      
      // Update post bookmark status
      const updatePostBookmark = (post: Post) => {
        if (post.id === postId) {
          post.bookmarked = bookmarked;
        }
      };
      
      state.posts.forEach(updatePostBookmark);
      state.myPosts.forEach(updatePostBookmark);
      
      // Update bookmarked posts set
      if (bookmarked) {
        state.bookmarkedPosts.add(postId);
      } else {
        state.bookmarkedPosts.delete(postId);
      }
    },
    
    sharePost: (state, action: PayloadAction<{
      postId: string;
      sharesCount: number;
    }>) => {
      const { postId, sharesCount } = action.payload;
      
      // Update post shares count
      const updatePostShares = (post: Post) => {
        if (post.id === postId) {
          post.shares = sharesCount;
        }
      };
      
      state.posts.forEach(updatePostShares);
      state.myPosts.forEach(updatePostShares);
    },
    
    setPostComments: (state, action: PayloadAction<{
      postId: string;
      comments: Comment[];
    }>) => {
      const { postId, comments } = action.payload;
      state.postComments[postId] = comments;
    },
    
    addComment: (state, action: PayloadAction<{
      postId: string;
      comment: Comment;
    }>) => {
      const { postId, comment } = action.payload;
      
      if (!state.postComments[postId]) {
        state.postComments[postId] = [];
      }
      
      state.postComments[postId].push(comment);
      
      // Update post comments count
      const updateCommentsCount = (post: Post) => {
        if (post.id === postId) {
          post.comments += 1;
        }
      };
      
      state.posts.forEach(updateCommentsCount);
      state.myPosts.forEach(updateCommentsCount);
    },
    
    likeComment: (state, action: PayloadAction<{
      postId: string;
      commentId: string;
      liked: boolean;
      likesCount: number;
    }>) => {
      const { postId, commentId, liked, likesCount } = action.payload;
      const comments = state.postComments[postId];
      
      if (comments) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.liked = liked;
          comment.likes = likesCount;
        }
      }
    },
    
    followUser: (state, action: PayloadAction<{
      userId: string;
      following: boolean;
    }>) => {
      const { userId, following } = action.payload;
      
      if (following) {
        state.following.add(userId);
      } else {
        state.following.delete(userId);
      }
    },
    
    setFilter: (state, action: PayloadAction<typeof initialState.currentFilter>) => {
      state.currentFilter = action.payload;
      
      // Reset pagination when filter changes
      state.page = 1;
      state.hasMore = true;
    },
    
    setLikedPosts: (state, action: PayloadAction<string[]>) => {
      state.likedPosts = new Set(action.payload);
    },
    
    setBookmarkedPosts: (state, action: PayloadAction<string[]>) => {
      state.bookmarkedPosts = new Set(action.payload);
    },
    
    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = new Set(action.payload);
    },
    
    setFollowers: (state, action: PayloadAction<string[]>) => {
      state.followers = new Set(action.payload);
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isPosting = false;
      state.refreshing = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetCommunity: (state) => {
      return initialState;
    },
    
    loadMorePosts: (state) => {
      if (!state.isLoading && state.hasMore) {
        state.isLoading = true;
      }
    },
    
    refreshPosts: (state) => {
      state.refreshing = true;
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setPosting,
  setRefreshing,
  setPosts,
  setMyPosts,
  addPost,
  updatePost,
  deletePost,
  likePost,
  bookmarkPost,
  sharePost,
  setPostComments,
  addComment,
  likeComment,
  followUser,
  setFilter,
  setLikedPosts,
  setBookmarkedPosts,
  setFollowing,
  setFollowers,
  setError,
  clearError,
  resetCommunity,
  loadMorePosts,
  refreshPosts,
} = communitySlice.actions;

export default communitySlice.reducer;

// Selectors
export const selectCommunity = (state: { community: CommunityState }) => state.community;
export const selectPosts = (state: { community: CommunityState }) => state.community.posts;
export const selectMyPosts = (state: { community: CommunityState }) => state.community.myPosts;
export const selectLikedPosts = (state: { community: CommunityState }) => state.community.likedPosts;
export const selectBookmarkedPosts = (state: { community: CommunityState }) => state.community.bookmarkedPosts;
export const selectFollowing = (state: { community: CommunityState }) => state.community.following;
export const selectPostComments = (postId: string) => (state: { community: CommunityState }) =>
  state.community.postComments[postId] || [];
export const selectCurrentFilter = (state: { community: CommunityState }) => state.community.currentFilter;
export const selectCommunityLoading = (state: { community: CommunityState }) => state.community.isLoading;
export const selectHasMorePosts = (state: { community: CommunityState }) => state.community.hasMore; 