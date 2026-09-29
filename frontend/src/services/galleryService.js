import api from './api.js';

export const galleryService = {
  getGalleryItems: () => api.get('/gallery'),
  getAdminGalleryItems: () => api.get('/gallery/admin'),
  createGalleryItem: (payload) => api.post('/gallery', payload),
  deleteGalleryItem: (id) => api.delete(`/gallery/${id}`)
};
