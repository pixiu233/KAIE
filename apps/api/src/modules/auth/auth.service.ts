// ============================================
// Auth 服务 - auth.service.ts
// ============================================
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    this.logger.log(`Login attempt for email: ${loginDto.email}`);

    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      this.logger.warn(`Login failed for email: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      this.logger.warn(`Login blocked for inactive user: ${loginDto.email}`);
      throw new UnauthorizedException('Account is not active');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    await this.usersService.updateLastLogin(user.id);

    this.logger.log(`Login successful for user: ${user.id}`);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
      user: this.sanitizeUser(user),
    };
  }

  async register(registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for email: ${registerDto.email}`);

    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      this.logger.warn(`Registration failed - email exists: ${registerDto.email}`);
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
    });

    this.logger.log(`Registration successful for user: ${user.id}`);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      user: this.sanitizeUser(user),
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken);

      const user = await this.usersService.findById(payload.sub);

      if (!user || user.status !== 'active') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = this.jwtService.sign(newPayload);
      const refreshToken = this.jwtService.sign(newPayload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      });

      return {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60,
      };
    } catch (error) {
      this.logger.error(`Refresh token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // In a more advanced implementation, you might want to
    // blacklist the refresh token or invalidate the session
    this.logger.log(`User logged out: ${userId}`);
    return { success: true };
  }

  private sanitizeUser(user: User) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
