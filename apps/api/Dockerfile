# ============================================
# API Dockerfile - apps/api/Dockerfile
# ============================================
# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 monorepo 配置
COPY package*.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# 复制 apps 配置
COPY apps/api/package*.json apps/api/
COPY apps/shared-types/package*.json apps/shared-types/

# 安装所有依赖（包括 monorepo）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 生成 Prisma 客户端
RUN cd apps/api && pnpm run prisma:generate

# 构建 API
RUN cd apps/api && pnpm run build

# ============================================
# 生产阶段
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package*.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod

# 复制构建产物
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 切换到 api 目录
WORKDIR /app/apps/api

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"]
