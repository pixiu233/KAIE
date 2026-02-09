// ============================================
// API Response Types - src/types/api.ts
// ============================================

// 用户类型（与后端 User Entity 对应）
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    avatar?: string;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

// 登录响应数据
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

// 注册响应数据
export interface RegisterResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: User;
}

// API 统一响应结构
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    timestamp: number;
    requestId: string;
}

// API 错误响应
export interface ApiError {
    code: number;
    message: string;
    error: string;
    timestamp: number;
    path: string;
    method: string;
    requestId: string;
}

// 认证相关请求
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

// ========== Chat Types ==========

export interface ChatMessage {
    id: string;
    chatId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    tokens?: number;
    createdAt: string;
}

export interface Chat {
    id: string;
    title: string;
    userId: string;
    model: string;
    status: string;
    messages?: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface ChatListResponse {
    chats: Chat[];
    total: number;
}

export interface ChatMessagesResponse {
    messages: ChatMessage[];
    total: number;
}

export interface CreateChatRequest {
    title: string;
    model?: string;
}

export interface UpdateChatRequest {
    title?: string;
    status?: string;
}

export interface SendMessageRequest {
    content: string;
}

export interface SendMessageResponse {
    id: string;
    chatId: string;
    role: 'assistant';
    content: string;
    tokens?: number;
    createdAt: string;
}

