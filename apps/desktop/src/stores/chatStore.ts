// ============================================
// Chat Store - src/stores/chatStore.ts
// ============================================
import { create } from 'zustand';
import { chatService, handleApiError } from '../api';
import type { Chat, ChatMessage } from '../types/api';

interface ChatState {
    chats: Chat[];
    currentChat: Chat | null;
    messages: ChatMessage[];
    totalChats: number;
    totalMessages: number;
    isLoading: boolean;
    isSending: boolean;
    error: string | null;

    // Actions
    fetchChats: (page?: number, limit?: number) => Promise<void>;
    fetchChat: (chatId: string) => Promise<Chat | null>;
    fetchMessages: (chatId: string, page?: number, limit?: number) => Promise<void>;
    createChat: (title: string, model?: string) => Promise<Chat>;
    updateChat: (chatId: string, data: { title?: string; status?: string }) => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, content: string) => Promise<void>;
    setCurrentChat: (chat: Chat | null) => void;
    clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chats: [],
    currentChat: null,
    messages: [],
    totalChats: 0,
    totalMessages: 0,
    isLoading: false,
    isSending: false,
    error: null,

    async fetchChats(page = 1, limit = 20) {
        set({ isLoading: true, error: null });
        try {
            const response = await chatService.getChats(page, limit);
            set({
                chats: response.data.chats,
                totalChats: response.data.total,
                isLoading: false,
            });
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false });
        }
    },

    async fetchChat(chatId: string): Promise<Chat | null> {
        set({ isLoading: true, error: null });
        try {
            const response = await chatService.getChat(chatId);
            const chat = response.data;
            // Add to chats list if not already present
            set((state) => ({
                chats: state.chats.some(c => c.id === chatId)
                    ? state.chats.map(c => c.id === chatId ? chat : c)
                    : [chat, ...state.chats],
                currentChat: chat,
                isLoading: false,
            }));
            return chat;
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false });
            return null;
        }
    },

    async fetchMessages(chatId: string, page = 1, limit = 50) {
        // Clear messages before fetching new ones
        set({ messages: [], isLoading: true, error: null });
        try {
            const response = await chatService.getMessages(chatId, page, limit);
            set({
                messages: response.data.messages,
                totalMessages: response.data.total,
                isLoading: false,
            });
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false });
        }
    },

    async createChat(title: string, model?: string) {
        set({ isLoading: true, error: null });
        try {
            const response = await chatService.createChat({ title, model });
            const newChat = response.data;
            set((state) => ({
                chats: [newChat, ...state.chats],
                currentChat: newChat,
                messages: [],
                isLoading: false,
            }));
            return newChat;
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false });
            throw error;
        }
    },

    async updateChat(chatId: string, data: { title?: string; status?: string }) {
        set({ isLoading: true, error: null });
        try {
            const response = await chatService.updateChat(chatId, data);
            const updatedChat = response.data;
            set((state) => ({
                chats: state.chats.map((c) => (c.id === chatId ? updatedChat : c)),
                currentChat: state.currentChat?.id === chatId ? updatedChat : state.currentChat,
                isLoading: false,
            }));
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false });
            throw error;
        }
    },

    async deleteChat(chatId: string) {
        set({ isLoading: true, error: null });
        try {
            await chatService.deleteChat(chatId);
            set((state) => ({
                chats: state.chats.filter((c) => c.id !== chatId),
                currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
                messages: state.currentChat?.id === chatId ? [] : state.messages,
                isLoading: false,
            }));
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false });
            throw error;
        }
    },

    async sendMessage(chatId: string, content: string) {
        set({ isSending: true, error: null });
        try {
            // Add user message immediately to UI
            const tempMessage: ChatMessage = {
                id: `temp-${Date.now()}`,
                chatId,
                role: 'user',
                content,
                createdAt: new Date().toISOString(),
            };
            set((state) => ({
                messages: [...state.messages, tempMessage],
            }));

            await chatService.sendMessage(chatId, { content });

            // Fetch updated messages to get the full list
            await get().fetchMessages(chatId);

            set({ isSending: false });
        } catch (error) {
            set({ error: handleApiError(error), isSending: false });
            throw error;
        }
    },

    setCurrentChat(chat: Chat | null) {
        set({ currentChat: chat, messages: chat?.messages || [] });
    },

    clearError() {
        set({ error: null });
    },
}));
