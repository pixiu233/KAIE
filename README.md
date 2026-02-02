# KAIE - Electron + React + NestJS 全栈产品

## 技术栈

- **前端**: Electron + React + Vite + TypeScript + Tailwind CSS
- **后端**: NestJS + Prisma + PostgreSQL + Redis + JWT
- **工程**: Docker + CI/CD + pnpm monorepo

## 快速开始

### 1. 安装依赖

```bash
# 安装 pnpm
npm install -g pnpm

# 安装所有依赖
pnpm install
```

### 2. 环境配置

```bash
# 复制环境变量模板
cp apps/api/.env.example apps/api/.env

# 编辑环境变量
vim apps/api/.env
```

### 3. 启动数据库

```bash
# 使用 Docker Compose 启动数据库
docker-compose up -d

# 或者本地安装 PostgreSQL 和 Redis
```

### 4. 启动开发环境

```bash
# 启动所有服务
pnpm dev

# 或分别启动
pnpm dev:api    # 后端
pnpm dev:desktop # 前端
```

## 项目结构

```
kaie/
├── apps/
│   ├── api/        # NestJS 后端
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── users/
│   │   │   │   └── health/
│   │   │   ├── common/
│   │   │   └── config/
│   │   └── prisma/
│   │
│   └── desktop/    # Electron 前端
│       ├── electron/
│       │   ├── main.ts
│       │   └── preload.ts
│       └── src/
│           ├── api/
│           ├── components/
│           ├── pages/
│           ├── stores/
│           └── types/
│
├── packages/
│   ├── shared-types/  # 共享类型定义
│   └── config/        # ESLint/TS/Prettier 配置
│
├── docker/
├── .cursor/
└── docker-compose.yml
```

## 可用命令

```bash
# 开发
pnpm dev              # 启动所有服务
pnpm dev:api          # 启动后端
pnpm dev:desktop      # 启动前端

# 构建
pnpm build            # 构建所有项目
pnpm build:api        # 构建后端
pnpm build:desktop    # 构建前端

# 数据库
pnpm db:generate      # 生成 Prisma 客户端
pnpm db:migrate       # 运行数据库迁移
pnpm db:studio        # 打开 Prisma Studio

# 代码质量
pnpm lint             # ESLint 检查
pnpm format           # Prettier 格式化

# 测试
pnpm test             # 运行测试
pnpm test:e2e         # E2E 测试
```

## 环境变量

### 后端 (.env)

```env
# 服务器
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# 数据库
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kaie

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

## API 文档

开发环境访问: http://localhost:3000/docs

## 许可证

MIT
