// ============================================
// Chat 页面容器 - src/pages/ChatPage.tsx
// ============================================
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatDetail } from '../components/ChatDetail';
import { useChatStore } from '../stores/chatStore';

export function ChatPage() {
    const { id } = useParams<{ id: string }>();
    const { fetchChats } = useChatStore();
    // Fetch chats on mount
    useEffect(() => {
        fetchChats();
    }, []);

    return (
        <div className="flex h-full bg-gray-50">
            {/* 聊天详情 */}
            <ChatDetail chatId={id} />
        </div>
    );
}
