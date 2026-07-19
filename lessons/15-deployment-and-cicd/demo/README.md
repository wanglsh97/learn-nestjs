# Lesson 15 Demo：部署与 CI/CD

这是 15 节课程的最终累计快照：完整知识管理 API、认证授权、安全边界、事务与幂等、缓存、后台任务、可观测性，以及本课新增的多阶段镜像、非 root 运行、Compose 拓扑、持久化卷和仓库级 CI 门禁。

## 直接在本地启动

在仓库根目录运行：

```bash
npm install
cp lessons/15-deployment-and-cicd/demo/.env.example lessons/15-deployment-and-cicd/demo/.env
npm run start:dev --workspace lesson-15-deployment-and-cicd-demo
```

默认地址为 `http://localhost:3015`，Swagger 位于 `http://localhost:3015/docs`。没有 Redis 时，缓存和任务使用进程内降级，仍可完成基础业务流程。

```bash
curl http://localhost:3015/api/health/live
curl http://localhost:3015/api/health/ready
curl http://localhost:3015/api/metrics
```

## 用 Compose 启动最终拓扑

确保 Docker Engine 正在运行，然后进入 Demo 目录：

```bash
docker compose up --build
```

Compose 会构建 app 镜像、等待 Redis 健康、启动应用，并把 SQL.js 文件保存到 `knowledge-data` 命名卷。另一个终端运行：

```bash
curl http://localhost:3015/api/health/live
curl http://localhost:3015/api/health/ready
curl http://localhost:3015/api/metrics
docker compose ps
```

预期就绪状态（readiness）为 `status: "ok"`、`database` 为 `up`、`cache` 为 `redis`、`queue` 为 `up`，两个容器最终显示 `healthy`。

停止容器但保留数据：

```bash
docker compose down
```

只有明确要删除本地 SQL.js 数据时才使用 `docker compose down -v`。

## 验证累计业务

Compose 中的管理员账号仅用于本地演示：

```bash
curl -X POST http://localhost:3015/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@example.com","password":"change-this-admin-password"}'
```

也可调用 `/api/auth/register` 创建普通用户，再通过 Bearer 令牌操作 `/api/notes`。发布接口还要求 `idempotency-key`：

```bash
curl -X POST http://localhost:3015/api/notes/<note-id>/publish \
  -H 'authorization: Bearer <access-token>' \
  -H 'idempotency-key: publish-request-1'
```

相同用户、相同幂等键、相同笔记会返回同一发布结果；把同一键用于另一篇笔记会返回 409。

## 镜像边界

- build 阶段编译 TypeScript，runtime 阶段只安装生产依赖并复制 `dist`。
- runtime 使用 Node 镜像自带的 `node` 非 root 用户。
- `.dockerignore` 不允许 `.env`、本地数据库、依赖和构建目录进入上下文。
- `/app/data` 归 `node` 用户所有，用于挂载持久化卷。

Compose 中的 `change-this-*` 是明确的本地占位符，不是生产秘密。课程 Demo 没有独立 lockfile，所以 Dockerfile 使用 `npm install`；生产镜像应把 lockfile 放入相同构建上下文并改用 `npm ci`。

## CI 与本地校验

真正被 GitHub 识别的工作流位于仓库根目录 `.github/workflows/ci.yml`。它对全部 Demo 执行 lint/build，只对测试主题的第 13 课执行测试，并构建本课镜像。

本课本地校验：

```bash
npm run lint --workspace lesson-15-deployment-and-cicd-demo
npm run build --workspace lesson-15-deployment-and-cicd-demo
docker build lessons/15-deployment-and-cicd/demo
```

本课不包含测试文件。CI/CD 平台凭据、镜像推送和云环境发布未写入仓库；它们应由实际平台的 Secret、环境保护和审批策略管理。
