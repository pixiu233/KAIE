// ============================================
// ChatItem - 聊天列表项组件
// ============================================
import { Dropdown, type MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Chat } from '../types/api';

interface ChatItemProps {
    chat: Chat;
    isActive: boolean;
    onSelect: (chat: Chat) => void;
    onDelete: (chatId: string) => void;
}

export function ChatItem({ chat, isActive, onSelect, onDelete }: ChatItemProps) {
    const navigate = useNavigate();

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        } else if (days === 1) {
            return '昨天';
        } else if (days < 7) {
            const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            return weeks[date.getDay()];
        } else {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
    };

    const handleSelect = () => {
        onSelect(chat);
        navigate(`/chat/${chat.id}`);
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'delete',
            label: '删除对话',
            danger: true,
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            // onClick: () => onDelete(chat.id),
        },
    ];

    return (
        <div
            onClick={handleSelect}
            className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 relative
                ${isActive
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">{chat.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(chat.updatedAt)}</p>
                    sdfsdf
                </div>

                {/* Dropdown 菜单 */}
                <Dropdown
                    menu={{ items: menuItems }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                            hover:bg-gray-100 transition-all duration-200`}
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </Dropdown>
            </div>
        </div>
    );
}
