import api from './api.js';

export const reservationService = {
  createReservation: (payload) => api.post('/reservations', payload),
  sendOtp: (payload) => api.post('/reservations/send-otp', payload),
  verifyOtp: (payload) => api.post('/reservations/verify-otp', payload),
  getMyReservations: () => api.get('/reservations/mine')
};
