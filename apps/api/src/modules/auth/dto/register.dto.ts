// ============================================
// 注册 DTO - auth/dto/register.dto.ts
// ============================================
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: '用户密码' })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @ApiProperty({ example: 'Password123!', description: '确认密码' })
  @IsString()
  confirmPassword: string;

  @ApiProperty({ example: 'John Doe', description: '用户名称' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}

