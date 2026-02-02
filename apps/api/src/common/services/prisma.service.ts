// ============================================
// Prisma 服务 - common/services/prisma.service.ts
// ============================================
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected to database');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma disconnected from database');
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('cleanDatabase is not allowed in production');
        }

        // 删除所有表数据（保留表结构）
        const tablenames = await this.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;

        for (const { tablename } of tablenames) {
            if (tablename !== '_prisma_migrations') {
                try {
                    await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
                } catch (error) {
                    // 忽略外键约束错误
                }
            }
        }
    }
}

