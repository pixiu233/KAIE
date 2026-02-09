// ============================================
// 更新 Chat DTO - modules/chat/dto/update-chat.dto.ts
// ============================================
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateChatDto {
  @ApiPropertyOptional({ example: 'Updated Chat Title' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'archived'] })
  @IsOptional()
  @IsString()
  status?: string;
}

