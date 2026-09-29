import api from './api.js';

export const contactService = {
  sendContact: (payload) => api.post('/contact', payload)
};
