// ============================================
// 对话页面 - src/pages/DashboardPage.tsx
// ============================================
import { useState, useRef, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Send, Bot, User, Sparkles, Loader2, RotateCcw, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

interface ContextType {
  chatSessions: ChatSession[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  createNewChat: () => void;
  updateSessions: (sessions: ChatSession[]) => void;
  resolvedTheme: 'light' | 'dark';
  colors: {
    bg: string;
    bgSecondary: string;
    bgTertiary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    hover: string;
    hoverSecondary: string;
    active: string;
    inactive: string;
    headerBg: string;
    inputBg: string;
    userBubble: string;
    assistantBubble: string;
    sidebarBg: string;
  };
}

export function DashboardPage() {
  const {
    chatSessions,
    currentSessionId,
    // setCurrentSessionId 用于在其他组件中切换会话，但在当前页面不需要
    updateSessions,
    resolvedTheme,
    colors,
  } = useOutletContext<ContextType>();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 获取当前会话
  const currentSession = chatSessions.find((s) => s.id === currentSessionId) || chatSessions[0];
  const messages = currentSession?.messages || [];

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 处理发送消息
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setInput('');
    setIsLoading(true);

    // 模拟 AI 响应
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I'm KAIE, your AI assistant. You said: "${userMessage.content}"\n\nThis is a demo response. In a real implementation, this would connect to an AI API like OpenAI or a local LLM.`,
      };

      // 更新消息
      const updatedSessions = chatSessions.map((session) => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages, userMessage, assistantMessage],
            title: session.title === 'New Chat' ? userMessage.content.slice(0, 50) : session.title,
          };
        }
        return session;
      });

      updateSessions(updatedSessions);
      setIsLoading(false);
    }, 1000);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 复制消息
  const copyToClipboard = async (content: string, messageId: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // 重新生成回复
  const regenerateResponse = () => {
    // 模拟重新生成
    setIsLoading(true);
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: 'Here\'s a regenerated response based on your previous message.',
      };

      const updatedSessions = chatSessions.map((session) => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...session.messages.filter((m) => m.role !== 'assistant' || session.messages.indexOf(m) !== session.messages.length - 1), assistantMessage],
          };
        }
        return session;
      });

      updateSessions(updatedSessions);
      setIsLoading(false);
    }, 1000);
  };

  // 主题颜色映射（用于输入框等特定元素）
  const inputColors = {
    light: {
      bg: 'bg-white',
      border: 'border-slate-300',
      text: 'text-slate-900',
      placeholder: 'placeholder-slate-400',
    },
    dark: {
      bg: 'bg-[#40414f]',
      border: 'border-transparent',
      text: 'text-white',
      placeholder: 'placeholder-slate-400',
    },
  };

  const inputColor = inputColors[resolvedTheme];

  return (
    <div className="flex flex-col h-full">
      {/* 欢迎页面（无消息时显示） */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg`}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* 欢迎文字 */}
            <div className="space-y-2">
              <h1 className={`text-3xl font-bold ${colors.text}`}>How can I help you today?</h1>
              <p className={colors.textMuted}>
                Start a conversation with KAIE, your AI assistant
              </p>
            </div>

            {/* 建议提示 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {[
                'Explain quantum computing',
                'Write a Python script',
                'Plan a weekly workout',
                'Help with math homework',
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion)}
                  className={`p-4 rounded-xl text-left transition-all ${colors.bgSecondary} ${colors.border} border hover:shadow-md`}
                >
                  <span className={`text-sm ${colors.text}`}>{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 消息列表 */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`group flex gap-4 ${message.role === 'user' ? '' : ''}`}
              >
                {/* 头像 */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${message.role === 'user'
                    ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                    : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                    }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* 消息内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${colors.text}`}>
                      {message.role === 'user' ? 'You' : 'KAIE'}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl px-4 py-3 ${message.role === 'user'
                      ? colors.userBubble
                      : colors.assistantBubble
                      }`}
                  >
                    <div className={`prose prose-sm max-w-none ${message.role === 'assistant' ? 'dark:prose-invert' : ''}`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>

                  {/* 消息操作按钮 */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(message.content, `msg-${index}`)}
                        className={`p-1.5 rounded-md ${colors.inactive} hover:bg-slate-100 dark:hover:bg-slate-700`}
                        title="Copy"
                      >
                        {copiedMessageId === `msg-${index}` ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <button
                        onClick={regenerateResponse}
                        className={`p-1.5 rounded-md ${colors.inactive} hover:bg-slate-100 dark:hover:bg-slate-700`}
                        title="Regenerate"
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 加载状态 */}
            {isLoading && (
              <div className="flex gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center"
                >
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className={`w-5 h-5 animate-spin ${colors.textMuted}`} />
                  <span className={colors.textMuted}>KAIE is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* 底部输入区域 */}
      <div className="border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div
            className={`
              flex items-end gap-2 rounded-xl border
              ${inputColor.bg} ${inputColor.border}
              ${resolvedTheme === 'dark' ? 'focus-within:ring-1 focus-within:ring-primary-500' : ''}
            `}
          >
            {/* 输入框 */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className={`
                flex-1 ${inputColor.bg} ${inputColor.text} ${inputColor.placeholder}
                border-0 rounded-xl px-4 py-3
                focus:outline-none focus:ring-0 resize-none
                max-h-48 min-h-[52px]
              `}
              rows={1}
              style={{
                height: 'auto',
                resize: 'none',
              }}
            />

            {/* 发送按钮 */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`
                p-3 rounded-xl transition-colors
                ${input.trim() && !isLoading
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : `${colors.textMuted} cursor-not-allowed`
                }
              `}
            >
              <Send size={18} />
            </button>
          </div>

          {/* 提示文字 */}
          <p className={`text-center text-xs ${colors.textMuted} mt-2`}>
            KAIE can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
