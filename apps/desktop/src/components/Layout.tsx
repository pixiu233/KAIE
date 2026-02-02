// ============================================
// Layout 组件 - 类 ChatGPT/豆包布局
// ============================================
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Settings,
  LogOut,
  Minimize2,
  Maximize2,
  X,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  MessageSquare,
  Plus,
  Trash2,
  Code2,
  ImageIcon,
  FileText,
  Music,
  Brain,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

// 功能模块类型
interface FeatureModule {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

// 预设功能模块
const featureModules: FeatureModule[] = [
  { id: 'general', name: '通用助手', icon: Brain, color: 'from-blue-500 to-blue-600', description: '日常问答和任务处理' },
  { id: 'coder', name: '代码专家', icon: Code2, color: 'from-emerald-500 to-emerald-600', description: '编程和代码审查' },
  { id: 'writer', name: '文案创作', icon: FileText, color: 'from-purple-500 to-purple-600', description: '写作和内容创作' },
  { id: 'image', name: '图像生成', icon: ImageIcon, color: 'from-pink-500 to-pink-600', description: 'AI图像生成' },
  { id: 'music', name: '音乐创作', icon: Music, color: 'from-red-500 to-red-600', description: '音乐和音频生成' },
];

interface ChatSession {
  id: string;
  title: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  createdAt: Date;
}

export function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { resolvedTheme, setTheme, initTheme } = useThemeStore();
  const [isMaximizedState, setIsMaximizedState] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Welcome to KAIE',
      messages: [
        { role: 'assistant', content: 'Hello! I\'m KAIE, your AI assistant. How can I help you today?' },
      ],
      createdAt: new Date(),
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('1');
  const [activeModule, setActiveModule] = useState('general');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const minimizeWindow = () => window.electronAPI?.windowMinimize();
  const toggleMaximize = async () => {
    await window.electronAPI?.windowMaximize();
    setIsMaximizedState(!isMaximizedState);
  };
  const closeWindow = () => window.electronAPI?.windowClose();

  // 初始化主题
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // 新建对话
  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        { role: 'assistant', content: 'Hello! I\'m KAIE, your AI assistant. How can I help you today?' },
      ],
      createdAt: new Date(),
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentSessionId(newSession.id);
  };

  // 更新会话列表
  const updateSessions = (sessions: ChatSession[]) => {
    setChatSessions(sessions);
  };

  // 主题颜色映射
  const themeColors = {
    light: {
      bg: 'bg-slate-50',
      bgSecondary: 'bg-white',
      bgTertiary: 'bg-slate-100',
      text: 'text-slate-900',
      textSecondary: 'text-slate-600',
      textMuted: 'text-slate-400',
      border: 'border-slate-200',
      hover: 'hover:bg-slate-100',
      hoverSecondary: 'hover:bg-slate-50',
      active: 'bg-primary-500/10 text-primary-600',
      inactive: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
      headerBg: 'bg-white border-slate-200',
      inputBg: 'bg-white border-slate-200',
      userBubble: 'bg-slate-200 text-slate-900',
      assistantBubble: 'bg-white border border-slate-200 text-slate-800',
      sidebarBg: 'bg-slate-100',
    },
    dark: {
      bg: 'bg-[#212121]',
      bgSecondary: 'bg-[#2f2f2f]',
      bgTertiary: 'bg-slate-800',
      text: 'text-[#ececec]',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      border: 'border-slate-700',
      hover: 'hover:bg-slate-700/50',
      hoverSecondary: 'hover:bg-slate-700/30',
      active: 'bg-primary-500/20 text-primary-400',
      inactive: 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200',
      headerBg: 'bg-[#2f2f2f] border-slate-700',
      inputBg: 'bg-[#40414f] border-transparent',
      userBubble: 'bg-[#2f2f2f] text-[#ececec]',
      assistantBubble: 'bg-[#2f2f2f] text-[#ececec]',
      sidebarBg: 'bg-[#202123]',
    },
  };

  const colors = themeColors[resolvedTheme];

  return (
    <div className={`flex h-screen ${colors.bg} ${colors.text} overflow-hidden`}>
      {/* 移动端遮罩层 */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`
          fixed lg:relative z-50 h-full flex flex-col
          ${sidebarCollapsed ? 'w-[70px]' : 'w-[260px]'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${colors.sidebarBg}
          transition-all duration-300 ease-in-out
        `}
      >
        {/* 侧边栏头部 */}
        <div className={`p-3 ${colors.border} border-b`}>
          <div className="flex items-center gap-3">
            {!sidebarCollapsed && (
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent truncate">
                KAIE
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-1.5 ${colors.inactive} rounded-md transition-colors ml-auto hidden lg:block`}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* 新建对话按钮 */}
        <div className="p-3">
          <button
            onClick={createNewChat}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors
              ${sidebarCollapsed ? 'justify-center' : ''}
              ${colors.hoverSecondary} border-slate-300 dark:border-slate-600
            `}
          >
            <Plus size={18} />
            {!sidebarCollapsed && <span className="text-sm font-medium">New Chat</span>}
          </button>
        </div>

        {/* 功能模块区域 */}
        {!sidebarCollapsed && (
          <div className="px-3 pb-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 mb-2">
              功能模块
            </p>
            <div className="grid grid-cols-2 gap-2">
              {featureModules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                    ${activeModule === module.id
                      ? 'bg-primary-500/10 border border-primary-500/30'
                      : `${colors.hoverSecondary} border border-transparent`
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                    <module.icon size={16} className="text-white" />
                  </div>
                  <span className={`text-xs ${activeModule === module.id ? 'text-primary-400 font-medium' : colors.textMuted}`}>
                    {module.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 对话历史列表 */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {!sidebarCollapsed && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-2">
              Today
            </p>
          )}
          {chatSessions.map((session) => (
            <div
              key={session.id}
              role="button"
              tabIndex={0}
              onClick={() => setCurrentSessionId(session.id)}
              onKeyDown={(e) => e.key === 'Enter' && setCurrentSessionId(session.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer
                ${currentSessionId === session.id
                  ? colors.active
                  : `${colors.textMuted} ${colors.hover}`
                }
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
              title={session.title}
            >
              <MessageSquare size={18} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 truncate text-sm">{session.title}</span>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      // 删除逻辑
                      const newSessions = chatSessions.filter(s => s.id !== session.id);
                      setChatSessions(newSessions);
                      // 如果删除的是当前会话，切换到第一个会话
                      if (session.id === currentSessionId && newSessions.length > 0) {
                        setCurrentSessionId(newSessions[0].id);
                      }
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-opacity"
                  >
                    <Trash2 size={14} />
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* 侧边栏底部 */}
        <div className={`p-3 ${colors.border} border-t space-y-2`}>
          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${colors.inactive} ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {!sidebarCollapsed && <span className="text-sm">{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* 设置按钮 */}
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${colors.inactive} ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <Settings size={18} />
            {!sidebarCollapsed && <span className="text-sm">Settings</span>}
          </button>

          {/* 用户信息 */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${colors.inactive} ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span className="text-sm">Logout</span>}
          </button>

          {/* 用户头像 */}
          {!sidebarCollapsed && (
            <div className={`flex items-center gap-3 px-3 py-2 ${colors.hoverSecondary} rounded-lg`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </div>
              <span className="text-sm font-medium truncate flex-1">{user?.name ?? 'User'}</span>
            </div>
          )}
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 自定义标题栏 */}
        <header
          className={`h-10 flex items-center justify-between draggable ${colors.headerBg}`}
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`p-2 ${colors.inactive} transition-colors lg:hidden`}
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <Menu size={18} />
          </button>

          <div className="flex-1" />

          <div
            className="flex items-center"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <button
              onClick={minimizeWindow}
              className={`p-2 ${colors.inactive} transition-colors`}
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={toggleMaximize}
              className={`p-2 ${colors.inactive} transition-colors`}
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={closeWindow}
              className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <Outlet
            context={{
              chatSessions,
              currentSessionId,
              setCurrentSessionId,
              createNewChat,
              updateSessions,
              resolvedTheme,
              colors,
            }}
          />
        </main>
      </div>
    </div>
  );
}
