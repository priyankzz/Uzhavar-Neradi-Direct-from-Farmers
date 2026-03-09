/**
 * Centralized API configuration
 * Copy to: frontend/src/services/api.ts
 */

import axios from 'axios';

// Use 127.0.0.1 instead of localhost for Windows compatibility
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log all requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response received:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - server not responding');
    } else if (!error.response) {
      // This is the "Network Error" you're seeing
      console.error('❌ Network Error - Cannot connect to server at', API_BASE_URL);
      console.error('   Possible causes:');
      console.error('   1. Django server not running');
      console.error('   2. Django running on different port');
      console.error('   3. Firewall blocking Node.js');
      console.error('   4. Windows Defender blocking connection');
    }
    return Promise.reject(error);
  }
);

export default api;