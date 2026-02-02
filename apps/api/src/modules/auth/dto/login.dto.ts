// ============================================
// 登录 DTO - auth/dto/login.dto.ts
// ============================================
import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: '用户邮箱' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: '用户密码' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: false, description: '是否记住我' })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}

