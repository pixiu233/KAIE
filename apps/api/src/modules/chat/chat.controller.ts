// ============================================
// Chat Controller - modules/chat/chat.controller.ts
// ============================================
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ========== Chat CRUD ==========

  @Post()
  @ApiOperation({ summary: '创建新的聊天会话' })
  @ApiResponse({ status: 201, description: '聊天创建成功' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createChatDto: CreateChatDto,
  ) {
    return this.chatService.create(userId, createChatDto);
  }

  @Get()
  @ApiOperation({ summary: '获取当前用户的所有聊天会话' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: '返回聊天列表' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
  ) {
    return this.chatService.findAllByUser(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定聊天会话详情' })
  @ApiResponse({ status: 200, description: '返回聊天详情' })
  @ApiResponse({ status: 404, description: '聊天不存在' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    const chat = await this.chatService.findById(id, userId);
    if (!chat) {
      return { message: 'Chat not found' };
    }
    return chat;
  }

  @Put(':id')
  @ApiOperation({ summary: '更新聊天会话' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    return this.chatService.update(id, userId, updateChatDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除聊天会话' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.chatService.remove(id, userId);
    return { message: 'Chat deleted successfully' };
  }

  // ========== Messages ==========

  @Post(':id/messages')
  @ApiOperation({ summary: '发送消息到聊天' })
  @ApiResponse({ status: 201, description: '消息发送成功' })
  async sendMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(id, userId, sendMessageDto);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: '获取聊天消息历史' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: '返回消息列表' })
  async getMessages(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 50,
  ) {
    return this.chatService.getMessages(id, userId, page, limit);
  }

  @Delete(':id/messages/:messageId')
  @ApiOperation({ summary: '删除指定消息' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async removeMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.chatService.removeMessage(messageId, userId);
    return { message: 'Message deleted successfully' };
  }
}

