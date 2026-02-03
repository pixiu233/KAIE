// ============================================
// React 根组件 - src/App.tsx
// ============================================
import { useEffect, useState } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { GlobalLayout } from './components/GlobalLayout';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { SettingsPage } from './pages/SettingsPage';
import { isDesktop } from './platform/runtime';
import { useAuthStore } from './stores/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#DDE5F7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
// 根据平台返回路由配置
function getRouteConfig() {
  const protectedRoutes = {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  };

  // 桌面端：使用 GlobalLayout（带窗口控制栏）
  if (isDesktop) {
    return [
      {
        element: <GlobalLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          protectedRoutes,
        ],
      },
      { path: '/', element: <Navigate to="/dashboard" replace /> },
    ];
  }

  // 浏览器端：直接渲染（无 GlobalLayout）
  return [
    { path: '/login', element: <LoginPage /> },
    protectedRoutes,
    { path: '/', element: <Navigate to="/dashboard" replace /> },
  ];
}

export default function App() {
  const routeConfig = getRouteConfig();
  const routes = useRoutes(routeConfig);
  return routes;
}
