import api from './api.js';

export const orderService = {
  createOrder: (payload) => api.post('/orders', payload),
  getMyOrders: () => api.get('/orders/mine'),
  getOrder: (id) => api.get(`/orders/${id}`),
  trackOrder: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
  downloadInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  createPaymentOrder: (payload) => api.post('/payments/create-order', payload),
  verifyPayment: (payload) => api.post('/payments/verify', payload)
};
