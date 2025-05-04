import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: Platform.select({
    ios: 'http://localhost:7860',
    android: 'http://10.0.2.2:7860',
    default: 'http://localhost:7860',
  }),
  
  // Default headers for all requests
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Timeout for requests in milliseconds
  TIMEOUT: 30000,
};

// API Endpoints
export const ENDPOINTS = {
  CHAT: {
    SEND_MESSAGE: '/ask',
    GET_HISTORY: '/chat/history',
    NEW_CHAT: '/chat/new',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
}; 