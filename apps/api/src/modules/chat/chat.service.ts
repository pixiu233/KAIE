// ============================================
// Chat Service - modules/chat/chat.service.ts
// ============================================
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { Prisma, Chat, ChatMessage } from '@prisma/client';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { AIService } from './services/ai.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AIService,
  ) {}

  // ========== Chat CRUD Operations ==========

  async create(userId: string, createChatDto: CreateChatDto): Promise<Chat> {
    this.logger.log(`Creating new chat for user: ${userId}`);

    const chat = await this.prisma.chat.create({
      data: {
        title: createChatDto.title,
        userId,
        model: createChatDto.model || 'gpt-3.5-turbo',
      },
    });

    this.logger.log(`Chat created successfully: ${chat.id}`);
    return chat;
  }

  async findAllByUser(userId: string, page = 1, limit = 20): Promise<{ chats: Chat[]; total: number }> {
    const [chats, total] = await this.prisma.$transaction([
      this.prisma.chat.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 1, // Include last message for preview
          },
        },
      }),
      this.prisma.chat.count({ where: { userId } }),
    ]);

    return { chats, total };
  }

  async findById(chatId: string, userId: string): Promise<Chat | null> {
    return this.prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async update(chatId: string, userId: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    this.logger.log(`Updating chat: ${chatId}`);

    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    return this.prisma.chat.update({
      where: { id: chatId },
      data: updateChatDto,
    });
  }

  async remove(chatId: string, userId: string): Promise<void> {
    this.logger.log(`Removing chat: ${chatId}`);

    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    await this.prisma.chat.delete({
      where: { id: chatId },
    });

    this.logger.log(`Chat removed successfully: ${chatId}`);
  }

  // ========== Message Operations ==========

  async sendMessage(chatId: string, userId: string, sendMessageDto: SendMessageDto): Promise<ChatMessage> {
    this.logger.log(`Sending message to chat: ${chatId}`);

    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    // Save user message
    const userMessage = await this.prisma.chatMessage.create({
      data: {
        chatId,
        role: 'user',
        content: sendMessageDto.content,
      },
    });

    // Update chat timestamp
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Get previous messages for context
    const previousMessages = await this.prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });

    const context = previousMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Call AI service (mock)
    const aiResponse = await this.aiService.generateResponse(
      sendMessageDto.content,
      chat.model,
    );

    // Save AI response
    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        chatId,
        role: 'assistant',
        content: aiResponse.content,
        tokens: aiResponse.tokens,
      },
    });

    this.logger.log(`Message sent successfully. AI tokens: ${aiResponse.tokens}`);

    return assistantMessage;
  }

  async getMessages(chatId: string, userId: string, page = 1, limit = 50): Promise<{ messages: ChatMessage[]; total: number }> {
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, userId },
    });

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    const [messages, total] = await this.prisma.$transaction([
      this.prisma.chatMessage.findMany({
        where: { chatId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Most recent first
      }),
      this.prisma.chatMessage.count({ where: { chatId } }),
    ]);

    return { messages: messages.reverse(), total }; // Reverse to show oldest first
  }

  async removeMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { chat: true },
    });

    if (!message || message.chat.userId !== userId) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    await this.prisma.chatMessage.delete({
      where: { id: messageId },
    });
  }
}

