'use client';
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://157.66.101.32:9200',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptor cho token
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.request.use(
  (config) => {
    config.headers['role'] = 'DOCTOR';
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);

export default instance;
