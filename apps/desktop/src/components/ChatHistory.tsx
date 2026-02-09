// ============================================
// ChatHistory - 聊天历史列表组件
// ============================================
import { Dropdown, type MenuProps, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../stores/chatStore';

interface ChatHistoryProps {
    collapsed?: boolean;
    colors: {
        textMuted: string;
        active: string;
        hover: string;
    };
}

export function ChatHistory({ collapsed = false, colors }: ChatHistoryProps) {
    const navigate = useNavigate();
    const {
        chats,
        currentChat,
        deleteChat,
        fetchChats,
        setCurrentChat
    } = useChatStore();

    // Select chat
    const handleSelectChat = (chat: typeof chats[0]) => {
        setCurrentChat(chat);
        navigate(`/chat/${chat.id}`);
    };

    // Delete chat with confirmation
    const handleDeleteChat = async (chatId: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这个对话吗？删除后无法恢复。',
            okText: '确认删除',
            okButtonProps: { danger: true },
            cancelText: '取消',
            onOk: async () => {
                try {
                    await deleteChat(chatId);
                    fetchChats();
                    if (currentChat?.id === chatId) {
                        navigate('/chat');
                    }
                } catch (err) {
                    console.error('Failed to delete chat:', err);
                }
            },
        });
    };

    // Menu items for dropdown
    const getMenuItems = (chatId: string): MenuProps['items'] => [
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
            onClick: () => handleDeleteChat(chatId),
        },
    ];

    return (
        <>
            {!collapsed && (
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-2">
                    聊天记录
                </p>
            )}
            {chats.map((chat) => (
                <div
                    key={chat.id}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer group
                        ${currentChat?.id === chat.id
                            ? colors.active
                            : `${colors.textMuted} ${colors.hover}`
                        }
                        ${collapsed ? 'justify-center' : ''}
                    `}
                    onClick={() => handleSelectChat(chat)}
                    title={chat.title}
                >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    {!collapsed && (
                        <>
                            <span className="flex-1 truncate text-sm">{chat.title}</span>

                            {/* 下拉菜单按钮 */}
                            <Dropdown
                                menu={{ items: getMenuItems(chat.id) }}
                                trigger={['click']}
                                placement="bottomRight"
                            >
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-all"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </button>
                            </Dropdown>
                        </>
                    )}
                </div>
            ))}
        </>
    );
}
