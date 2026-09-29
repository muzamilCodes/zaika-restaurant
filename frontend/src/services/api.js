import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore.js';

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = 'http://localhost:5000/api';
const normalizeApiBaseUrl = (value) => {
  if (!value || !/^https?:\/\//.test(value)) {
    return defaultApiUrl;
  }

  const trimmed = value.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const apiBaseURL = normalizeApiBaseUrl(rawApiUrl);

if (rawApiUrl && apiBaseURL === defaultApiUrl) {
  console.warn(`Invalid VITE_API_URL value: ${rawApiUrl}. Falling back to ${defaultApiUrl}`);
}

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const skipRefresh =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/forgot-password') ||
      originalRequest?.url?.includes('/auth/reset-password');

    if (error.response?.status === 401 && !skipRefresh && !originalRequest._retry && !refreshing) {
      originalRequest._retry = true;
      refreshing = true;
      try {
        const response = await axios.post(
          `${apiBaseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setAccessToken(response.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
