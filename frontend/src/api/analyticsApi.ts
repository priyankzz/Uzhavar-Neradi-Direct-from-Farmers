/**
 * Analytics API
 * Copy to: frontend/src/api/analyticsApi.ts
 */

import axiosInstance from './axiosConfig';

export const analyticsApi = {
  // Farmer analytics
  getDemandInsights: () => axiosInstance.get('/analytics/demand-insights/'),
  getPredictions: () => axiosInstance.get('/analytics/predictions/'),
  getSalesReport: (period?: string) => axiosInstance.get('/analytics/sales-report/', { params: { period } }),
  getSeasonalTrends: () => axiosInstance.get('/analytics/seasonal-trends/'),
  
  // Admin analytics
  getPlatformStats: () => axiosInstance.get('/analytics/platform-stats/'),
  getUserGrowth: (period?: string) => axiosInstance.get('/analytics/user-growth/', { params: { period } }),
  getTopProducts: (limit?: number) => axiosInstance.get('/analytics/top-products/', { params: { limit } }),
  getRegionAnalysis: () => axiosInstance.get('/analytics/region-analysis/'),
};