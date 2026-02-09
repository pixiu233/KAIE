// ============================================
// 发送消息 DTO - modules/chat/dto/send-message.dto.ts
// ============================================
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 'Hello, how are you?', description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;
}

