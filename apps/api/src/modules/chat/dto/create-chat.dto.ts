// ============================================
// 创建 Chat DTO - modules/chat/dto/create-chat.dto.ts
// ============================================
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: 'New Chat', description: 'Chat title' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'gpt-3.5-turbo', description: 'AI model name' })
  @IsOptional()
  @IsString()
  model?: string;
}

