import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message, ChatUser } from '../../types';

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversation: string | null;
  unreadCount: number;
  typing: Record<string, string[]>; // conversationId -> array of user IDs typing
  onlineUsers: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastSeen: Record<string, number>; // userId -> timestamp
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeConversation: null,
  unreadCount: 0,
  typing: {},
  onlineUsers: {},
  isLoading: false,
  error: null,
  isConnected: false,
  lastSeen: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      state.unreadCount = action.payload.reduce((total, conv) => total + conv.unreadCount, 0);
    },
    
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const conversation = action.payload;
      const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        state.conversations[existingIndex] = conversation;
      } else {
        state.conversations.unshift(conversation);
      }
      
      state.unreadCount = state.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    },
    
    updateConversation: (state, action: PayloadAction<Partial<Conversation> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const conversation = state.conversations.find(c => c.id === id);
      
      if (conversation) {
        Object.assign(conversation, updates);
        state.unreadCount = state.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
      }
    },
    
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversation = action.payload;
      
      // Mark active conversation as read
      if (action.payload) {
        const conversation = state.conversations.find(c => c.id === action.payload);
        if (conversation && conversation.unreadCount > 0) {
          conversation.unreadCount = 0;
          state.unreadCount = state.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
        }
      }
    },
    
    setMessages: (state, action: PayloadAction<{
      conversationId: string;
      messages: Message[];
      append?: boolean;
    }>) => {
      const { conversationId, messages, append = false } = action.payload;
      
      if (append && state.messages[conversationId]) {
        state.messages[conversationId] = [...state.messages[conversationId], ...messages];
      } else {
        state.messages[conversationId] = messages;
      }
    },
    
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const conversationId = message.conversationId;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      // Check if message already exists (to prevent duplicates)
      const existingMessage = state.messages[conversationId].find(m => m.id === message.id);
      if (!existingMessage) {
        state.messages[conversationId].push(message);
        
        // Update conversation last message
        const conversation = state.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.lastMessage = message;
          conversation.updatedAt = message.createdAt;
          
          // Increment unread count if not in active conversation
          if (state.activeConversation !== conversationId) {
            conversation.unreadCount += 1;
            state.unreadCount += 1;
          }
          
          // Move conversation to top
          state.conversations = [
            conversation,
            ...state.conversations.filter(c => c.id !== conversationId)
          ];
        }
      }
    },
    
    updateMessage: (state, action: PayloadAction<Partial<Message> & {
      id: string;
      conversationId: string;
    }>) => {
      const { id, conversationId, ...updates } = action.payload;
      const messages = state.messages[conversationId];
      
      if (messages) {
        const messageIndex = messages.findIndex(m => m.id === id);
        if (messageIndex >= 0) {
          Object.assign(messages[messageIndex], updates);
        }
      }
    },
    
    markMessageAsRead: (state, action: PayloadAction<{
      messageId: string;
      conversationId: string;
    }>) => {
      const { messageId, conversationId } = action.payload;
      const messages = state.messages[conversationId];
      
      if (messages) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
          message.status = 'read';
        }
      }
    },
    
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (conversation && conversation.unreadCount > 0) {
        state.unreadCount -= conversation.unreadCount;
        conversation.unreadCount = 0;
      }
    },
    
    setTyping: (state, action: PayloadAction<{
      conversationId: string;
      userId: string;
      isTyping: boolean;
    }>) => {
      const { conversationId, userId, isTyping } = action.payload;
      
      if (!state.typing[conversationId]) {
        state.typing[conversationId] = [];
      }
      
      const typingUsers = state.typing[conversationId];
      const userIndex = typingUsers.indexOf(userId);
      
      if (isTyping && userIndex === -1) {
        typingUsers.push(userId);
      } else if (!isTyping && userIndex >= 0) {
        typingUsers.splice(userIndex, 1);
      }
    },
    
    setUserOnlineStatus: (state, action: PayloadAction<{
      userId: string;
      isOnline: boolean;
    }>) => {
      const { userId, isOnline } = action.payload;
      state.onlineUsers[userId] = isOnline;
      
      if (isOnline) {
        state.lastSeen[userId] = Date.now();
      }
    },
    
    setLastSeen: (state, action: PayloadAction<{
      userId: string;
      timestamp: number;
    }>) => {
      const { userId, timestamp } = action.payload;
      state.lastSeen[userId] = timestamp;
    },
    
    sendMessageStart: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      message.status = 'sending';
      
      if (!state.messages[message.conversationId]) {
        state.messages[message.conversationId] = [];
      }
      
      state.messages[message.conversationId].push(message);
    },
    
    sendMessageSuccess: (state, action: PayloadAction<{
      tempId: string;
      message: Message;
    }>) => {
      const { tempId, message } = action.payload;
      const messages = state.messages[message.conversationId];
      
      if (messages) {
        const tempMessageIndex = messages.findIndex(m => m.id === tempId);
        if (tempMessageIndex >= 0) {
          messages[tempMessageIndex] = message;
        }
      }
    },
    
    sendMessageFailure: (state, action: PayloadAction<{
      tempId: string;
      conversationId: string;
      error: string;
    }>) => {
      const { tempId, conversationId } = action.payload;
      const messages = state.messages[conversationId];
      
      if (messages) {
        const messageIndex = messages.findIndex(m => m.id === tempId);
        if (messageIndex >= 0) {
          messages[messageIndex].status = 'failed';
        }
      }
    },
    
    deleteMessage: (state, action: PayloadAction<{
      messageId: string;
      conversationId: string;
    }>) => {
      const { messageId, conversationId } = action.payload;
      const messages = state.messages[conversationId];
      
      if (messages) {
        state.messages[conversationId] = messages.filter(m => m.id !== messageId);
      }
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetChat: (state) => {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setConnected,
  setConversations,
  addConversation,
  updateConversation,
  setActiveConversation,
  setMessages,
  addMessage,
  updateMessage,
  markMessageAsRead,
  markConversationAsRead,
  setTyping,
  setUserOnlineStatus,
  setLastSeen,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  deleteMessage,
  setError,
  clearError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectChat = (state: { chat: ChatState }) => state.chat;
export const selectConversations = (state: { chat: ChatState }) => state.chat.conversations;
export const selectActiveConversation = (state: { chat: ChatState }) => state.chat.activeConversation;
export const selectMessages = (conversationId: string) => (state: { chat: ChatState }) => 
  state.chat.messages[conversationId] || [];
export const selectUnreadCount = (state: { chat: ChatState }) => state.chat.unreadCount;
export const selectTypingUsers = (conversationId: string) => (state: { chat: ChatState }) =>
  state.chat.typing[conversationId] || [];
export const selectIsConnected = (state: { chat: ChatState }) => state.chat.isConnected;
export const selectOnlineUsers = (state: { chat: ChatState }) => state.chat.onlineUsers; 