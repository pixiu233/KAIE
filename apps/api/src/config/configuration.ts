// ============================================
// 配置文件 - config/configuration.ts
// ============================================
export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',

  database: {
    url: process.env.DATABASE_URL ?? '',
  },

  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD ?? undefined,
    db: parseInt(process.env.REDIS_DB ?? '0', 10),
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? 'default-secret-change-me',
    accessTokenExpiresIn:
      process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '15m',
    refreshTokenExpiresIn:
      process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '7d',
  },

  encryption: {
    key: process.env.ENCRYPTION_KEY ?? 'default-32-char-key-change-me!!',
    iv: process.env.ENCRYPTION_IV ?? 'default-16-iv!!',
  },

  swagger: {
    title: process.env.SWAGGER_TITLE ?? 'KAIE API',
    description: process.env.SWAGGER_DESCRIPTION ?? 'KAIE API 文档',
    version: process.env.SWAGGER_VERSION ?? '1.0',
    enable: process.env.SWAGGER_ENABLE !== 'false',
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },

  cors: {
    origin: (process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean),
    credentials: process.env.CORS_CREDENTIALS?.toLowerCase() === 'true' || true,
  },

  logging: {
    level: process.env.LOG_LEVEL ?? 'debug',
    format: process.env.LOG_FORMAT ?? 'json',
  },
});

export type AppConfiguration = ReturnType<typeof configuration>;

