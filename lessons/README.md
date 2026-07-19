# 五天课程路线

本课程面向有多年 TypeScript/前端工程经验、希望转向全栈开发的学习者。共 15 节，每天 3 节，以 `demo/` 中的知识管理 API 为贯穿项目。

## 第 1 天：NestJS 核心

1. [NestJS 架构与启动流程](01-nestjs-architecture/index.md) — [Demo](01-nestjs-architecture/demo/README.md)
2. [Module 与 Dependency Injection (DI)](02-modules-and-dependency-injection/index.md) — [Demo](02-modules-and-dependency-injection/demo/README.md)
3. [请求生命周期](03-request-lifecycle/index.md) — [Demo](03-request-lifecycle/demo/README.md)

## 第 2 天：API 与数据

4. [REST、DTO、校验与 Swagger](04-rest-dto-validation-swagger/index.md) — [Demo](04-rest-dto-validation-swagger/demo/README.md)
5. [数据库、ORM 与迁移](05-database-orm-migrations/index.md) — [Demo](05-database-orm-migrations/demo/README.md)
6. [CRUD、分页、异常与配置](06-crud-pagination-errors-config/index.md) — [Demo](06-crud-pagination-errors-config/demo/README.md)

## 第 3 天：认证与安全

7. [用户与 JWT 认证](07-jwt-authentication/index.md) — [Demo](07-jwt-authentication/demo/README.md)
8. [授权与 RBAC](08-authorization-rbac/index.md) — [Demo](08-authorization-rbac/demo/README.md)
9. [应用安全](09-application-security/index.md) — [Demo](09-application-security/demo/README.md)

## 第 4 天：生产级业务能力

10. [事务、并发与幂等](10-transactions-concurrency-idempotency/index.md) — [Demo](10-transactions-concurrency-idempotency/demo/README.md)
11. [Redis 与缓存](11-redis-caching/index.md) — [Demo](11-redis-caching/demo/README.md)
12. [消息队列与后台任务](12-queues-and-background-jobs/index.md) — [Demo](12-queues-and-background-jobs/demo/README.md)

## 第 5 天：质量与交付

13. [自动化测试](13-testing/index.md) — [Demo](13-testing/demo/README.md)
14. [日志与可观测性](14-observability/index.md) — [Demo](14-observability/demo/README.md)
15. [部署与 CI/CD](15-deployment-and-cicd/index.md) — [Demo](15-deployment-and-cicd/demo/README.md)

英文版本位于每个课程目录中的 `index.en.md`。

## 核心能力参考

[NestJS 核心能力参考](reference/README.md)集中整理 Module、ConfigModule、HttpModule、JwtModule、SQL Database、Controller、Provider、Decorator、Middleware、Guard、Interceptor、Pipe 和 Exception Filter 的职责、注册方式与最小代码示例。它用于开发时快速查阅，不替代按顺序学习课程和运行 Demo。

## 运行方式

每个 Demo 都是完整的 NestJS 项目，并且是上一课的累计快照。先在仓库根目录执行一次 `npm install`，然后进入任意课程的 `demo/`：

```bash
npm install
cd lessons/01-nestjs-architecture/demo
npm run start:dev
```

课程默认端口为 `3001` 到 `3015`。第 11 课以后可用 Docker Compose 启动 Redis；没有 Redis 时应用使用内存降级，仍可运行。
