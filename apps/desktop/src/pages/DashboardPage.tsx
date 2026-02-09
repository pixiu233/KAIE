// ====================================
// Dashboard 页面 - 欢迎页面
// ====================================
import { Bot, Code2, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

export function DashboardPage() {
  const { fetchChats, chats } = useChatStore();

  const colors = {
    bg: 'bg-[#DDE5F7]',
    bgSecondary: 'bg-white',
    text: 'text-slate-900',
    textMuted: 'text-slate-400',
    border: 'border-primary-200',
    hover: 'hover:bg-primary-100',
    hoverSecondary: 'hover:bg-primary-50',
  };

  // 初始化时获取 chat 列表
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="flex flex-col h-full">
      {/* 欢迎页面 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* 欢迎文字 */}
          <div className="text-center space-y-4 mb-12">
            <h1 className={`text-4xl font-bold ${colors.text}`}>欢迎使用 KAIE</h1>
            <p className={`text-lg ${colors.textMuted}`}>
              您的 AI 助手，为您提供智能对话和创意支持
            </p>
            {chats.length > 0 && (
              <p className={`text-sm ${colors.textMuted}`}>
                您有 {chats.length} 个对话记录
              </p>
            )}
          </div>

          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Bot,
                title: 'AI 对话',
                description: '智能问答和日常助手',
                color: 'from-blue-500 to-blue-600',
                path: '/chat',
              },
              {
                icon: Code2,
                title: '代码专家',
                description: '编程和代码审查',
                color: 'from-emerald-500 to-emerald-600',
                path: '/chat',
              },
              {
                icon: FileText,
                title: '文案创作',
                description: '写作和内容创作',
                color: 'from-purple-500 to-purple-600',
                path: '/chat',
              },
              {
                icon: ImageIcon,
                title: '图像生成',
                description: 'AI 图像生成 (即将推出)',
                color: 'from-pink-500 to-pink-600',
                path: '/chat',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${colors.bgSecondary} rounded-2xl p-6 border ${colors.border} hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${colors.text} mb-1`}>{item.title}</h3>
                <p className={`text-sm ${colors.textMuted}`}>{item.description}</p>
              </div>
            ))}
          </div>

          {/* 快捷操作 */}
          <div className="mt-12 text-center">
            <p className={`text-sm ${colors.textMuted} mb-4`}>快速开始</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                '帮我写一封邮件',
                '解释什么是机器学习',
                '用 Python 实现快速排序',
                '设计一个 Logo',
              ].map((suggestion, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full ${colors.bgSecondary} ${colors.border} border text-sm ${colors.text} hover:shadow-md transition-all`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息 */}
      <div className={`border-t ${colors.border} py-4`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className={`text-xs ${colors.textMuted}`}>
            KAIE v1.0.0 · 您的 AI 智能助手
          </p>
        </div>
      </div>
    </div>
  );
}
