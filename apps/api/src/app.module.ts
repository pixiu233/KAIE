// ============================================
// 应用模块 - app.module.ts
// ============================================
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './common/modules/prisma.module';
import { configuration } from './config/configuration';

@Module({
    imports: [
        // 配置模块
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            envFilePath: ['.env.local', '.env'],
        }),

        // 限流模块
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                throttlers: [
                    {
                        ttl: configService.get<number>('THROTTLE_TTL', 60) * 1000,
                        limit: configService.get<number>('THROTTLE_LIMIT', 100),
                    },
                ],
            }),
        }),

        // Prisma 数据库模块
        PrismaModule,

        // 功能模块
        AuthModule,
        UsersModule,
        HealthModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
