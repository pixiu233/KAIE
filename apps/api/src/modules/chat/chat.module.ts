// ============================================
// Chat Module - modules/chat/chat.module.ts
// ============================================
import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AIService } from './services/ai.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, AIService],
  exports: [ChatService],
})
export class ChatModule {}

