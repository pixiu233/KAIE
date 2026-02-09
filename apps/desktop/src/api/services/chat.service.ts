// ============================================
// Chat API 服务 - api/services/chat.service.ts
// ============================================
import type {
    ApiResponse,
    Chat,
    ChatListResponse,
    ChatMessage,
    ChatMessagesResponse,
    CreateChatRequest,
    SendMessageRequest,
    UpdateChatRequest,
} from '../../types/api';
import { api } from '../client';

export const chatService = {
    /** 获取聊天列表 */
    async getChats(page = 1, limit = 20): Promise<ApiResponse<ChatListResponse>> {
        const response = await api.get<ApiResponse<ChatListResponse>>('/chat', {
            params: { page, limit },
        });
        return response.data;
    },

    /** 获取单个聊天详情 */
    async getChat(chatId: string): Promise<ApiResponse<Chat>> {
        const response = await api.get<ApiResponse<Chat>>(`/chat/${chatId}`);
        return response.data;
    },

    /** 创建新聊天 */
    async createChat(data: CreateChatRequest): Promise<ApiResponse<Chat>> {
        const response = await api.post<ApiResponse<Chat>>('/chat', data);
        return response.data;
    },

    /** 更新聊天 */
    async updateChat(chatId: string, data: UpdateChatRequest): Promise<ApiResponse<Chat>> {
        const response = await api.put<ApiResponse<Chat>>(`/chat/${chatId}`, data);
        return response.data;
    },

    /** 删除聊天 */
    async deleteChat(chatId: string): Promise<void> {
        await api.delete(`/chat/${chatId}`);
    },

    /** 获取消息列表 */
    async getMessages(chatId: string, page = 1, limit = 50): Promise<ApiResponse<ChatMessagesResponse>> {
        const response = await api.get<ApiResponse<ChatMessagesResponse>>(`/chat/${chatId}/messages`, {
            params: { page, limit },
        });
        return response.data;
    },

    /** 发送消息 */
    async sendMessage(chatId: string, data: SendMessageRequest): Promise<ApiResponse<ChatMessage>> {
        const response = await api.post<ApiResponse<ChatMessage>>(`/chat/${chatId}/messages`, data);
        return response.data;
    },

    /** 删除消息 */
    async deleteMessage(chatId: string, messageId: string): Promise<void> {
        await api.delete(`/chat/${chatId}/messages/${messageId}`);
    },
};
