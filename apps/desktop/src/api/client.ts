// ============================================
// API Client - src/api/client.ts
// ============================================
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { ApiResponse, ApiError } from '../types/api';

// 扩展 Axios 请求配置类型以支持 _retry 属性
interface ExtendedAxiosRequestConfig {
  _retry?: boolean;
}

declare module 'axios' {
  interface InternalAxiosRequestConfig extends ExtendedAxiosRequestConfig { }
}

// 获取 Vite 环境变量
const getEnv = () => (import.meta as { env?: { DEV?: boolean } }).env ?? {};
const isDev = getEnv()?.DEV ?? false;

// API 基础配置
const API_BASE_URL = isDev ? 'http://localhost:3000/api/v1' : 'http://localhost:3000/api/v1';

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证令牌
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器 - 处理错误和 Token 刷新
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config;

    // 401 错误且未重试过
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest!._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post<ApiResponse<{ accessToken: string }>>(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          useAuthStore.getState().setAccessToken(accessToken);
          originalRequest!.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest!);
        }
      } catch (refreshError) {
        // 刷新失败，清除认证状态
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API 错误处理
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? error.message ?? 'Network error';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
