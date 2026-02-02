# Electron + React + NestJS 全栈产品架构与 Vibe Coding 规则集

> 目标：为个人/小团队构建一套**可商业化、可扩展、可长期维护、AI 协作友好**的全栈产品架构

技术栈已锁定：
- 前端：Electron + React + Vite + TypeScript + Tailwind CSS
- 后端：NestJS + Prisma + PostgreSQL + Redis + JWT
- 工程：Docker + CI/CD + Cursor Vibe Coding

---

# 一、总体架构蓝图

## 架构模式
> **模块化单体 + 桌面客户端 + API 服务**

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

特点：
- 桌面端 = 业务入口
- 后端 = 权限、数据、支付、风控中枢
- 可平滑扩展为 Web / Mobile 客户端

---

# 二、系统分层设计

## Electron 分层

```
Electron
├── Main Process   (系统能力层)
│   ├── 窗口管理
│   ├── 系统权限
│   ├── 自动更新
│   └── 安全策略
│
├── Preload Layer  (安全桥接层)
│   └── IPC API 白名单
│
└── Renderer (React)
    ├── UI / State
    ├── API Client
    └── 权限路由
```

原则：
> Renderer 永远不能直接访问 Node API

---

## 后端分层

```
Controller → Service → Prisma → Database
        ↓
      Guard
```

模块：
- Auth
- User
- Admin
- Payment
- Subscription
- Audit
- Notification

---

# 三、通信与安全模型

## Electron → Backend

方式：
- HTTPS (Axios / Fetch)
- JWT + Refresh Token

安全规则：
- Token 只存内存，不落磁盘
- Refresh Token 存系统安全存储（Keychain / Credential Vault）
- 所有请求必须走 HTTPS

---

# 四、推荐项目结构

## Monorepo 结构

```
root/
├── apps/
│   ├── desktop/        # Electron + React
│   └── api/            # NestJS
│
├── packages/
│   ├── shared-types/  # 前后端共享 DTO / Types
│   └── config/        # ESLint / TS / Prettier
│
├── docker/
│
└── .cursor/
```

---

## Desktop App 结构

```
apps/desktop/
├── electron/
│   ├── main.ts
│   ├── preload.ts
│   └── updater.ts
│
├── src/
│   ├── app/
│   ├── modules/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── api/
│   └── router/
│
└── vite.config.ts
```

---

## Backend 结构

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── admin/
│   │   ├── payment/
│   │   └── audit/
│   ├── common/
│   └── prisma/
│
└── docker-compose.yml
```

---

# 五、前后端类型共享方案

## shared-types

内容：
- DTO 接口
- API Response 类型
- Enum / 常量

规则：
> 后端定义 → 前端消费

推荐工具：
- tsup 打包
- pnpm workspace

---

# 六、权限与身份系统

## 权限模型

```
用户 → 角色 → 权限 → 前端路由 + 后端接口
```

实现：
- 后端：JWT + RBAC Guard
- 前端：Route Guard + Permission Hook

---

# 七、Electron 安全规范（必须遵守）

## Main Process
- 禁止 nodeIntegration
- 开启 contextIsolation

## Preload
- 只暴露白名单 API

## Renderer
- 不允许 eval
- 不允许远程脚本

---

# 八、Vibe Coding 规则系统

## .cursor/rules.md

```md
# AI 行为规范

你是本项目的系统架构师和高级全栈工程师

目标：
构建一个商业级 Electron + Web + API 产品系统

## 核心原则
- 优先安全
- 优先可维护性
- 优先可扩展性
- 拒绝 Demo 级实现

## 架构约束
- Renderer 不得访问 Node API
- 所有系统调用必须走 Preload
- Controller 不得包含业务逻辑
- Service 不得包含 HTTP 细节

## 工程规范
- TypeScript 强类型
- 禁止 any
- 模块化结构
- 所有接口必须有 DTO

## 输出规范
- 按文件结构输出
- 标注安全关键点
- 不允许省略核心实现
```

---

## .cursor/architecture.md

```md
# 系统架构规则

## 客户端
- Electron 负责系统能力
- React 负责 UI 和业务

## 服务端
- NestJS 模块化单体
- Redis 管状态
- PostgreSQL 存业务

## 通信
- HTTPS + JWT

## 扩展策略
- API 无状态
- 支持横向扩展
```

---

# 九、标准开发流

## 功能开发顺序

1. Prisma Schema
2. Nest Module
3. API 文档
4. 前端 API Client
5. React 模块
6. Electron 集成

---

# 十、部署架构

```
Nginx
  ↓
NestJS API
  ↓
PostgreSQL
  ↓
Redis

Electron 自动更新服务器
```

---

# 十一、商业级增强

- 自动更新系统
- 崩溃上报（Sentry）
- 操作审计
- 支付系统
- 订阅系统
- 风控系统

---

# 十二、Cursor Snippet 示例

## 全栈模块生成

```
为本项目生成一个完整模块

模块名：${1}

要求：
- 后端 NestJS 模块
- Prisma 数据模型
- Swagger 文档
- 前端 React 页面
- Electron 集成
- 权限控制

按目录结构输出
```

---

# 十三、长期演进路线

阶段 1：
- 登录系统
- 用户系统
- 桌面端壳

阶段 2：
- 权限系统
- 管理后台

阶段 3：
- 支付
- 订阅

阶段 4：
- 风控
- 审计
- 监控

---

# 十四、你将获得什么

- 一套可复制的商业系统底座
- AI 协作开发流程
- 全栈统一架构

---

# 十五、推荐你下一步

我可以给你：
> **Monorepo 启动模板（pnpm + Electron + NestJS + Docker + Cursor Rules）**

你 clone 就能直接开始写产品

---

如果你愿意告诉我：
- 产品是 SaaS / AI 工具 / 管理系统 / 客户端产品
- 是否需要离线模式
- 是否需要内网部署

我可以给你定制一套**完全贴合你业务的“全栈架构 + Cursor AI 工作流”**

