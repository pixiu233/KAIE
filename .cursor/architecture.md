# 系统架构规则

## 技术栈

### 前端
- Electron 负责系统能力
- React 负责 UI 和业务
- Vite 构建工具
- TypeScript 类型安全
- Tailwind CSS 样式

### 后端
- NestJS 模块化单体
- Prisma ORM
- PostgreSQL 主数据库
- Redis 缓存和会话
- JWT 认证

## 架构模式

### 客户端
```
┌────────────────────┐
│   Electron App     │
│  (React Renderer) │
└─────────┬──────────┘
          │ HTTPS / IPC
┌─────────▼──────────┐
│    NestJS API      │
│  Auth / User /    │
│  Payment / Admin  │
└─────────┬──────────┘
          │
┌─────────▼──────────┐
│ PostgreSQL + Redis│
└────────────────────┘
```

### 后端分层
```
Controller → Service → Prisma → Database
        ↓
      Guard
```

## 通信与安全

### 认证
- JWT + Refresh Token
- Token 只存内存，不落磁盘
- Refresh Token 存系统安全存储

### API 安全
- Helmet 安全头
- CORS 严格配置
- 限流保护
- 输入验证

## 扩展策略
- API 无状态
- 支持横向扩展
- 数据库读写分离
- 缓存策略

## 环境配置
- development: 本地开发
- staging: 测试环境
- production: 生产环境

## 依赖管理
- pnpm workspace
- 版本锁定
- 依赖审计

