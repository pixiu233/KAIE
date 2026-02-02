# KAIE 后端调试指南

## 启动服务

### 方式一：开发模式（热重载）
```bash
cd apps/api
pnpm start:dev
```

### 方式二：生产模式
```bash
cd apps/api
pnpm build
pnpm start:prod
```

### 方式三：直接运行
```bash
cd apps/api
node dist/main.js
```

---

## 数据库命令

### 启动 PostgreSQL
```bash
# 使用 Homebrew 管理
brew services start postgresql@15
brew services stop postgresql@15
brew services restart postgresql@15

# 查看状态
brew services list
```

### 启动 Redis
```bash
brew services start redis
brew services stop redis
brew services restart redis

# 查看状态
redis-cli ping
# 返回 PONG 表示正常
```

### 数据库连接
```bash
# 连接 PostgreSQL
psql -U songsikai -d kaie

# 查看所有表
\dt

# 查看表结构
\d users

# 退出
\q
```

### Prisma 命令

```bash
# 生成 Prisma 客户端
pnpm prisma generate

# 运行迁移
pnpm prisma migrate dev

# 查看迁移状态
pnpm prisma migrate status

# 回滚迁移
pnpm prisma migrate deploy

# 打开 Prisma Studio（GUI 管理）
pnpm prisma studio

# 重置数据库（开发环境）
pnpm prisma migrate reset
```

---

## 日志查看

### 应用日志
```bash
# 实时查看应用日志（开发模式自动输出）
tail -f /Users/songsikai/Desktop/work/KAIE/apps/api/logs/app.log
```

### 数据库日志
```bash
# PostgreSQL 日志位置
tail -f /opt/homebrew/var/log/postgresql@15/postgresql-*.log
```

---

## API 测试

### 健康检查
```bash
curl http://localhost:3000/api/v1/health
```

### 登录
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 注册
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Password123!", "confirmPassword": "Password123!", "name": "Test User"}'
```

### 获取当前用户
```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer <your-token>"
```

---

## Swagger 文档

访问地址：http://localhost:3000/docs

---

## 端口检查

```bash
# 查看端口占用
lsof -i :3000  # API
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# 杀掉占用端口的进程
kill -9 <PID>
```

---

## Docker（可选）

如果使用 Docker 启动：

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f api

# 停止所有服务
docker-compose down

# 重启某个服务
docker-compose restart api
```

---

## 常见问题

### 1. 数据库连接失败
```bash
# 检查 PostgreSQL 是否启动
brew services list

# 重新启动
brew services restart postgresql@15
```

### 2. Prisma 客户端过期
```bash
# 重新生成
pnpm prisma generate
```

### 3. 迁移冲突
```bash
# 重置数据库（开发环境）
pnpm prisma migrate reset --force
```

### 4. 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀掉进程
kill -9 <PID>
```

---

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| NODE_ENV | 环境 | development |
| PORT | API 端口 | 3000 |
| DATABASE_URL | 数据库连接 | postgresql://... |
| REDIS_HOST | Redis 主机 | localhost |
| REDIS_PORT | Redis 端口 | 6379 |
| JWT_SECRET | JWT 密钥 | - |
| JWT_ACCESS_TOKEN_EXPIRES_IN | Access Token 过期时间 | 15m |
| JWT_REFRESH_TOKEN_EXPIRES_IN | Refresh Token 过期时间 | 7d |
| CORS_ORIGIN | CORS 允许的源 | http://localhost:5173 |

