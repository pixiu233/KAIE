// ============================================
// 全局窗口布局组件 - 仅包含标题栏（用于窗口拖拽）
// ============================================
import { Outlet } from 'react-router-dom';
import { useThemeStore } from '../stores/themeStore';

export function GlobalLayout() {
    const { resolvedTheme } = useThemeStore();
    const colors = {
        light: {
            bg: 'bg-white',
            headerBg: 'bg-primary-100',
            inactive: 'text-gray-400 hover:bg-gray-50 hover:text-gray-600',
        },
        dark: {
            bg: 'bg-[#212121]',
            headerBg: 'bg-[#2f2f2f] border-slate-700',
            inactive: 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200',
        },
    }[resolvedTheme];

    return (
        <div className={`h-screen flex flex-col ${colors.bg}`}>
            {/* 全局标题栏 - 支持窗口拖拽 */}
            <header
                className={`h-10 flex items-center justify-between ${colors.headerBg}`}
                style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
            >
            </header>

            {/* 主内容区 */}
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}

