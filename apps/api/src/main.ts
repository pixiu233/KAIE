// ============================================
// NestJS 应用入口 - main.ts
// ============================================
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // 安全中间件
  app.use(helmet());

  // CORS 配置
  const corsOrigin = configService.get<string>('CORS_ORIGIN')?.split(',') ?? [];
  app.enableCors({
    origin: corsOrigin,
    credentials: configService.get<boolean>('CORS_CREDENTIALS') ?? true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // API 前缀
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局拦截器
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger 文档
  const swaggerEnable = configService.get<boolean>('SWAGGER_ENABLE', true);
  if (swaggerEnable) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get<string>('SWAGGER_TITLE', 'KAIE API'))
      .setDescription(
        configService.get<string>(
          'SWAGGER_DESCRIPTION',
          'KAIE 全栈产品 API 文档',
        ),
      )
      .setVersion(
        configService.get<string>('SWAGGER_VERSION', '1.0') ?? '1.0',
      )
      .addBearerAuth()
      .addTag('auth', '认证模块')
      .addTag('users', '用户模块')
      .addTag('health', '健康检查')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 KAIE API Server running on: http://localhost:${port}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/docs`);
}

bootstrap();

