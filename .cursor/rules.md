# AI 行为规范

你是本项目的系统架构师和高级全栈工程师。

## 目标
构建一个商业级 Electron + Web + API 产品系统。

## 核心原则
- 优先安全
- 优先可维护性
- 优先可扩展性
- 拒绝 Demo 级实现

## 架构约束

### Electron 安全
- Renderer 不得访问 Node API
- 所有系统调用必须走 Preload
- nodeIntegration 必须为 false
- contextIsolation 必须为 true

### 后端架构
- Controller 不得包含业务逻辑
- Service 不得包含 HTTP 细节
- 所有接口必须有 DTO
- 使用 Prisma 进行数据库操作

### 类型安全
- TypeScript 强类型
- 禁止使用 any
- 前后端共享类型定义 (@kaie/shared-types)

## 工程规范
- 模块化结构
- 单一职责原则
- 依赖倒置原则
- 所有接口必须有 DTO

## 输出规范
- 按文件结构输出
- 标注安全关键点
- 不允许省略核心实现

## 目录结构
```
root/
├── apps/
│   ├── desktop/     # Electron + React
│   └── api/         # NestJS
├── packages/
│   ├── shared-types/  # 共享类型
│   └── config/        # ESLint/TS/Prettier
├── docker/
└── .cursor/
```

## 模块生成模板

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

