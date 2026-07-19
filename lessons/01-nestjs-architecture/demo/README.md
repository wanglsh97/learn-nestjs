# Lesson 01 Demo

这是第一课配套的最小完整 NestJS 应用，用于观察启动入口、根模块、功能模块、控制器（Controller）和默认 Express 平台。

## 运行

先在仓库根目录安装一次工作区依赖：

```bash
npm install
cd lessons/01-nestjs-architecture/demo
npm run start:dev
```

默认端口为 `3001`：

```bash
curl http://localhost:3001/api
curl http://localhost:3001/api/health
```

根路由响应：

```json
{
  "name": "lesson-01-demo",
  "message": "Hello NestJS!",
  "endpoints": ["GET /", "GET /health"]
}
```

`endpoints` 使用相对于全局前缀的路径；默认前缀是 `/api`，改为 `APP_PREFIX=v1` 后对应地址就是 `/v1` 和 `/v1/health`。

健康检查响应：

```json
{
  "status": "ok",
  "lesson": 1,
  "platform": "express"
}
```

## 观察环境变量

第一课暂不引入配置模块，直接用命令行环境变量观察 `main.ts` 的启动配置：

```bash
PORT=4001 APP_PREFIX=v1 npm run start:dev
curl http://localhost:4001/v1/health
```

## 项目结构

```text
demo/
├── src/
│   ├── main.ts                    # 应用入口
│   ├── app.setup.ts               # 从入口逻辑中分离的应用配置
│   ├── app.module.ts              # 根模块
│   ├── app.controller.ts          # 根路由
│   └── health/
│       ├── health.module.ts       # 功能模块
│       └── health.controller.ts   # 健康检查路由
├── nest-cli.json
├── package.json
└── tsconfig.json
```

## 验证

```bash
npm run lint
npm run format
npm run build
```

第一课只要求能运行和解释这套骨架，不包含测试用例。提供者（Provider）、依赖注入和模块导入导出会在第二课展开，自动化测试集中到第 13 课。
