/**
 * Product API
 * Copy to: frontend/src/api/productApi.ts
 */

import axiosInstance from './axiosConfig';

export const productApi = {
  getProducts: (params?: any) => axiosInstance.get('/products/', { params }),
  getProduct: (id: number) => axiosInstance.get(`/products/${id}/`),
  createProduct: (data: FormData) => axiosInstance.post('/products/create/', data),
  updateProduct: (id: number, data: FormData) => axiosInstance.put(`/products/${id}/update/`, data),
  deleteProduct: (id: number) => axiosInstance.delete(`/products/${id}/delete/`),
  getFarmerProducts: (farmerId: number) => axiosInstance.get(`/products/farmer/${farmerId}/`),
  getCategories: () => axiosInstance.get('/products/categories/'),
  
  // Reviews
  getReviews: (productId: number) => axiosInstance.get(`/products/${productId}/reviews/`),
  addReview: (productId: number, data: any) => axiosInstance.post(`/products/${productId}/reviews/`, data),
};