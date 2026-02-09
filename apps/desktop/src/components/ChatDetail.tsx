// ============================================
// ChatDetail - 聊天详情组件
// ============================================
import { useEffect, useRef, useState } from 'react';
import { handleApiError } from '../api/client';
import { useChatStore } from '../stores/chatStore';

interface ChatDetailProps {
    chatId?: string;
}

export function ChatDetail({ chatId }: ChatDetailProps) {
    const {
        currentChat,
        messages,
        isLoading,
        isSending,
        fetchChat,
        fetchMessages,
        sendMessage,
        setCurrentChat,
    } = useChatStore();

    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // 防止重复请求的 ref
    const lastFetchedChatId = useRef<string | null>(null);

    // Fetch chat and messages when chatId changes
    useEffect(() => {
        if (!chatId) {
            setCurrentChat(null);
            lastFetchedChatId.current = null;
            return;
        }

        // 如果已经获取过这个 chat，不再重复获取
        if (lastFetchedChatId.current === chatId && currentChat?.id === chatId) {
            return;
        }

        lastFetchedChatId.current = chatId;
        fetchChat(chatId);
        fetchMessages(chatId);
    }, [chatId, fetchChat, fetchMessages, setCurrentChat, currentChat?.id]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
    };

    // Send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentChat || isSending) return;

        const content = newMessage.trim();
        setNewMessage('');
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        try {
            await sendMessage(currentChat.id, content);
        } catch (err) {
            console.error('Failed to send message:', handleApiError(err));
        }
    };

    // Format time
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!currentChat && !chatId) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200
                                   rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">开始新的对话</h3>
                    <p className="text-gray-400">点击上方按钮开始聊天</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col">
            {/* 聊天头部 */}
            <header className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">{currentChat?.title || '加载中...'}</h2>
                    {currentChat && (
                        <p className="text-xs text-gray-400 mt-0.5">
                            使用模型: {currentChat.model}
                        </p>
                    )}
                </div>
            </header>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoading && messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>暂无消息，开始发送消息吧</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={message.id || index}
                                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* 头像 */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                                    ${message.role === 'user'
                                        ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                                        : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                                    }`}
                                >
                                    {message.role === 'user' ? (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>

                                {/* 消息内容 */}
                                <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : ''}`}>
                                    <div className={`inline-block px-5 py-3 rounded-2xl whitespace-pre-wrap text-sm
                                        ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-sm'
                                            : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm'
                                        }`}
                                    >
                                        {message.content}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5">
                                        {formatTime(message.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* 正在发送 */}
                        {isSending && (
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                </div>
                                <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="px-6 py-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="输入消息..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none
                                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                       placeholder-gray-400 text-gray-700"
                            rows={1}
                            disabled={isSending || !currentChat}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending || !currentChat}
                        className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl
                                   shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all duration-200 flex items-center justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
