import api from './api.js';

export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  createReview: (payload) => api.post('/reviews', payload),
  getReviews: (productId) => api.get(`/reviews/product/${productId}`)
};
