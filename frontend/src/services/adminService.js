import api from './api.js';

export const adminService = {
  dashboard: () => api.get('/admin/dashboard'),
  orders: () => api.get('/admin/orders'),
  reservations: () => api.get('/admin/reservations'),
  users: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`)
};
