// ============================================
// Theme Store - src/stores/themeStore.ts
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  initTheme: () => void;
}

// 检测系统主题偏好
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// 解析主题模式为实际主题
const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

// 应用主题到 HTML 元素
const applyTheme = (resolvedTheme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'dark',

      setTheme: (theme: ThemeMode) => {
        const resolved = resolveTheme(theme);
        set({ theme, resolvedTheme: resolved });
        applyTheme(resolved);
      },

      initTheme: () => {
        const { theme } = get();
        const resolved = resolveTheme(theme);
        set({ resolvedTheme: resolved });
        applyTheme(resolved);

        // 监听系统主题变化
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            const { theme } = get();
            if (theme === 'system') {
              const resolved = getSystemTheme();
              set({ resolvedTheme: resolved });
              applyTheme(resolved);
            }
          };

          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'theme-storage',
    },
  ),
);
