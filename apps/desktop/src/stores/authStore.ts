// ============================================
// Auth Store - src/stores/authStore.ts
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/client';
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../types/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAccessToken: (token: string) => {
        set({ accessToken: token, isAuthenticated: true });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password } as LoginRequest);
          const { accessToken, refreshToken, user } = response.data.data;
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          // 存储 refreshToken 到 localStorage
          localStorage.setItem('refreshToken', refreshToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await api.post<ApiResponse<RegisterResponse>>('/auth/register', data);
          const { accessToken, refreshToken, user } = response.data.data;
          set({
            user,
            accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          // 存储 refreshToken 到 localStorage
          localStorage.setItem('refreshToken', refreshToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {
          // 忽略登出错误
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
          localStorage.removeItem('refreshToken');
          delete api.defaults.headers.common['Authorization'];
        }
      },

      checkAuth: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isAuthenticated: false });
          return false;
        }
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const response = await api.get<ApiResponse<User>>('/auth/me');
          set({
            user: response.data.data,
            isAuthenticated: true,
          });
          return true;
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false });
          delete api.defaults.headers.common['Authorization'];
          return false;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
