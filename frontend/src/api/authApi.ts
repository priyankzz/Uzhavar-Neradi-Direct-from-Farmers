/**
 * Authentication API
 * Copy to: frontend/src/api/authApi.ts
 */

import axiosInstance from './axiosConfig';

export const authApi = {
  register: (data: any) => axiosInstance.post('/auth/register/', data),
  login: (email: string, password: string) => axiosInstance.post('/auth/login/', { email, password }),
  verifyOTP: (email: string, otp: string) => axiosInstance.post('/auth/verify-otp/', { email, otp }),
  resendOTP: (email: string) => axiosInstance.post('/auth/resend-otp/', { email }),
  getProfile: () => axiosInstance.get('/auth/profile/'),
  updateProfile: (data: any) => axiosInstance.put('/auth/profile/', data),
  
  // Role-specific profiles
  createFarmerProfile: (data: any) => axiosInstance.post('/auth/farmer/create/', data),
  getFarmerProfile: () => axiosInstance.get('/auth/farmer/profile/'),
  createCustomerProfile: (data: any) => axiosInstance.post('/auth/customer/create/', data),
  getCustomerProfile: () => axiosInstance.get('/auth/customer/profile/'),
  createDeliveryProfile: (data: any) => axiosInstance.post('/auth/delivery/create/', data),
  getDeliveryProfile: () => axiosInstance.get('/auth/delivery/profile/'),
};