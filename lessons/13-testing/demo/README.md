# Lesson 13 Demo

本课是课程中唯一保留测试代码的 Demo，包含纯配置与 Guard 单元测试、AuthService + SQL.js/JWT 集成测试，以及完整 HTTP E2E。

## 静态验证与测试

```bash
cd lessons/13-testing/demo
npm run lint
npm run build
npm test
npm run test:e2e
```

`npm test` 应执行 3 个 Suite：配置、RolesGuard、AuthService 集成；`test:e2e` 执行匿名访问、创建与所有权、幂等发布、权限边界 4 个场景。测试设置 `REDIS_URL=''`，不需要 Docker。

## E2E 环境

`test/setup-env.ts` 在导入 AppModule 前设置测试 JWT 密钥和位于系统临时目录的 SQL.js 文件。每个 E2E 场景创建自己的用户和 Note，结束时关闭 Nest 应用并删除数据库。

## 手工运行

```bash
cp .env.example .env
REDIS_URL= npm run start:dev
```

默认 API 为 `http://localhost:3013/api`，Swagger 为 `http://localhost:3013/docs`。后续第 14、15 课不复制本课测试文件。
