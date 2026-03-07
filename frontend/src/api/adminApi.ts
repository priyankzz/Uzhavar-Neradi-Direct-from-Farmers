/**
 * Admin API
 * Copy to: frontend/src/api/adminApi.ts
 */

import axiosInstance from './axiosConfig';

export const adminApi = {
  // Dashboard
  getDashboard: () => axiosInstance.get('/admin/dashboard/'),
  
  // Users
  getUsers: (params?: any) => axiosInstance.get('/admin/users/', { params }),
  getUser: (id: number) => axiosInstance.get(`/admin/users/${id}/`),
  verifyUser: (userId: number, action: 'approve' | 'reject', reason?: string) =>
    axiosInstance.post(`/admin/users/${userId}/verify/`, { action, rejection_reason: reason }),
  toggleUserStatus: (userId: number) => axiosInstance.post(`/admin/users/${userId}/toggle-status/`),
  
  // Verifications
  getVerifications: () => axiosInstance.get('/admin/verifications/'),
  getVerification: (id: number) => axiosInstance.get(`/admin/verifications/${id}/`),
  approveVerification: (id: number) => axiosInstance.post(`/admin/verifications/${id}/approve/`),
  rejectVerification: (id: number, reason: string) => 
    axiosInstance.post(`/admin/verifications/${id}/reject/`, { reason }),
  
  // Settings
  getLogo: () => axiosInstance.get('/admin/settings/logo/'),
  uploadLogo: (data: FormData) => axiosInstance.post('/admin/settings/logo/', data),
  getSettings: () => axiosInstance.get('/admin/settings/'),
  updateSettings: (key: string, value: string) => axiosInstance.post('/admin/settings/', { key, value }),
  
  // Middleman
  getFlags: (status?: string) => axiosInstance.get('/admin/middleman/flags/', { params: { status } }),
  getFlag: (id: number) => axiosInstance.get(`/admin/middleman/flags/${id}/`),
  resolveFlag: (id: number, action: string, notes: string) =>
    axiosInstance.post(`/admin/middleman/flags/${id}/resolve/`, { action, notes }),
  getSuspiciousUsers: () => axiosInstance.get('/admin/middleman/suspicious/'),
  
  // Disputes
  getDisputes: (status?: string) => axiosInstance.get('/admin/disputes/', { params: { status } }),
  getDispute: (id: number) => axiosInstance.get(`/admin/disputes/${id}/`),
  resolveDispute: (id: number, resolution: string, action: string) =>
    axiosInstance.post(`/admin/disputes/${id}/resolve/`, { resolution, action }),
  
  // Categories
  getCategories: () => axiosInstance.get('/admin/categories/'),
  createCategory: (data: FormData) => axiosInstance.post('/admin/categories/', data),
  updateCategory: (id: number, data: FormData) => axiosInstance.put(`/admin/categories/${id}/`, data),
  
  // Festivals
  getFestivals: () => axiosInstance.get('/admin/festivals/'),
  createFestival: (data: any) => axiosInstance.post('/admin/festivals/', data),
  updateFestival: (id: number, data: any) => axiosInstance.put(`/admin/festivals/${id}/`, data),
};