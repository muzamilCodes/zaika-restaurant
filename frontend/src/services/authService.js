import api from './api.js';

export const authService = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  sendOtp: (payload) => api.post('/auth/send-otp', payload),
  verifyOtp: (payload) => api.post('/auth/verify-otp', payload),
  logout: () => api.post('/auth/logout', {}),
  me: () => api.get('/auth/me'),
  updateProfile: (payload) => api.patch('/auth/me', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload)
};
