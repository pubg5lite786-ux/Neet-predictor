export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
  },
  // Colleges
  COLLEGES: {
    LIST: '/api/colleges',
    DETAIL: (id: string) => `/api/colleges/${id}`,
    SEARCH: '/api/colleges/search',
    SAVE: (id: string) => `/api/colleges/${id}/save`,
  },
  // Predictor
  PREDICTOR: {
    PREDICT: '/api/predictor/predict',
    RESULTS: (resultId: string) => `/api/predictor/results/${resultId}`,
  },
  // Cut-off
  CUTOFF: {
    LIST: '/api/cutoff',
    BY_STATE: (state: string) => `/api/cutoff/${state}`,
    BY_CATEGORY: (state: string, category: string) => `/api/cutoff/${state}/${category}`,
  },
  // Mock Tests
  TESTS: {
    LIST: '/api/mock-tests',
    DETAIL: (id: string) => `/api/mock-tests/${id}`,
    START: (id: string) => `/api/mock-tests/${id}/start`,
    SUBMIT: (id: string) => `/api/mock-tests/${id}/submit`,
    RESULTS: (id: string, resultId: string) => `/api/mock-tests/${id}/results/${resultId}`,
  },
  // MCQ Tests
  MCQ_TESTS: {
    LIST: '/api/mcq-tests',
    DETAIL: (id: string) => `/api/mcq-tests/${id}`,
    START: (id: string) => `/api/mcq-tests/${id}/start`,
    SUBMIT: (id: string) => `/api/mcq-tests/${id}/submit`,
  },
  // Forum
  FORUM: {
    DISCUSSIONS: '/api/forum/discussions',
    CREATE: '/api/forum/discussions',
    DETAIL: (id: string) => `/api/forum/discussions/${id}`,
    ANSWER: (id: string) => `/api/forum/discussions/${id}/answer`,
  },
  // News
  NEWS: {
    LIST: '/api/news',
    DETAIL: (id: string) => `/api/news/${id}`,
  },
  // Alerts
  ALERTS: {
    LIST: '/api/alerts',
    DETAIL: (id: string) => `/api/alerts/${id}`,
  },
};
