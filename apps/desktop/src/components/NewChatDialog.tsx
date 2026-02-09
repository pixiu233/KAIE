// ============================================
// NewChatDialog - 新建对话全屏对话框
// ============================================
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';

interface NewChatDialogProps {
    open: boolean;
    onClose: () => void;
}

export function NewChatDialog({ open, onClose }: NewChatDialogProps) {
    const navigate = useNavigate();
    const { createChat, setCurrentChat } = useChatStore();
    const [title, setTitle] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when dialog opens
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    // Reset state when dialog closes
    useEffect(() => {
        if (!open) {
            setTitle('');
        }
    }, [open]);

    const handleCreateChat = async () => {
        if (!title.trim()) return;

        try {
            const chat = await createChat(title.trim());
            setTitle('');
            onClose();
            setCurrentChat(chat);
            navigate(`/chat/${chat.id}`);
        } catch (err) {
            console.error('Failed to create chat:', err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onKeyDown={handleKeyDown}
        >
            {/* 背景遮罩 */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 全屏对话框内容 */}
            <div className="relative w-full max-w-2xl mx-4">
                <div className="bg-white dark:bg-[#2f2f2f] rounded-2xl shadow-2xl overflow-hidden">
                    {/* 头部 */}
                    <div className="px-8 py-6 border-b border-gray-200 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-[#ececec]">
                            开始新对话
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                            为你的对话起一个名字
                        </p>
                    </div>

                    {/* 输入区域 */}
                    <div className="px-8 py-6">
                        <input
                            ref={inputRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="输入对话标题..."
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-[#40414f] border border-gray-200 dark:border-slate-600 rounded-xl
                                       text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                                       placeholder-gray-400 dark:placeholder-slate-500 text-gray-700 dark:text-[#ececec]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCreateChat();
                                }
                            }}
                        />
                    </div>

                    {/* 操作按钮 */}
                    <div className="px-8 py-6 bg-gray-50 dark:bg-[#3a3a3a] flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 dark:text-slate-300 hover:text-gray-800
                                       dark:hover:text-slate-200 font-medium text-lg transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleCreateChat}
                            disabled={!title.trim()}
                            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white
                                       rounded-xl font-medium text-lg shadow-lg hover:shadow-xl
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            开始对话
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

