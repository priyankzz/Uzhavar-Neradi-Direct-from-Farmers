import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = sessionStorage.getItem('refresh');
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/token/refresh/`, { refresh });
        sessionStorage.setItem('access', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        // token refresh failed – will redirect to login
      }
    }
    return Promise.reject(error);
  }
);
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token attached for:', config.url);
  } else {
    console.log('No token for:', config.url);
  }
  return config;
});

export default api;