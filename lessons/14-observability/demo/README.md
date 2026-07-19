# Lesson 14 Demo：日志与可观测性

这是第 14 课的独立累计快照。在前 13 课知识管理 API 的基础上，新增受约束的 Request ID、结构化请求日志、Prometheus 文本指标，以及区分存活与就绪语义的健康检查。

## 启动

在仓库根目录运行：

```bash
npm install
cp lessons/14-observability/demo/.env.example lessons/14-observability/demo/.env
npm run start:dev --workspace lesson-14-observability-demo
```

应用默认监听 `http://localhost:3014`，Swagger 位于 `http://localhost:3014/docs`。首次启动会在 Demo 目录创建 SQL.js 数据文件并执行迁移，同时创建 `.env` 中配置的管理员。

Redis 不是基础演示的硬依赖。没有 Redis 时，缓存和后台任务使用进程内降级；如需观察 Redis 与 BullMQ：

```bash
cd lessons/14-observability/demo
docker compose up -d redis
```

## 观察关联日志

```bash
curl -i http://localhost:3014/api/health/live \
  -H 'x-request-id: local-observe-001'
```

响应预期为 `200`，响应头回显 `x-request-id: local-observe-001`。终端会输出一条 JSON 请求日志，包含相同的 `requestId`、`method`、`path`、`statusCode` 和 `durationMs`。认证请求还会包含 `userId`，但不会记录令牌、请求体或查询串。

无效或超过 128 字符的 Request ID 不会被沿用，响应会返回服务器生成的 UUID。

## 观察健康状态

```bash
curl http://localhost:3014/api/health/live
curl http://localhost:3014/api/health/ready
```

基础本地模式的 readiness 示例：

```json
{
  "status": "ok",
  "dependencies": {
    "database": "up",
    "cache": "memory",
    "queue": "up"
  }
}
```

启动 Redis 后，缓存连接成功时 `cache` 变为 `redis`。`live` 只检查进程响应；`ready` 才检查数据库和运行依赖模式。

## 观察指标

```bash
curl http://localhost:3014/api/health/live
curl http://localhost:3014/api/missing
curl http://localhost:3014/api/metrics
```

`/api/metrics` 返回 Prometheus 文本，包括请求总数、5xx 总数和累计耗时。计数只存在于当前进程内，重启会清零；404 不计入 `knowledge_http_errors_total`，该指标只统计 5xx。

## 累计业务接口

可通过 `/api/auth/register` 创建用户，再操作 `/api/notes`。管理员默认凭据来自 `.env`：

```bash
curl -X POST http://localhost:3014/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@example.com","password":"admin-password"}'
```

发布笔记需要 Bearer 令牌和幂等键：

```bash
curl -X POST http://localhost:3014/api/notes/<note-id>/publish \
  -H 'authorization: Bearer <access-token>' \
  -H 'idempotency-key: publish-request-1'
```

## 校验与本课边界

```bash
npm run lint --workspace lesson-14-observability-demo
npm run build --workspace lesson-14-observability-demo
```

根据课程规则，本课不包含测试用例，行为通过本地启动后的日志、健康和指标端点直接观察。Demo 使用进程内指标和 Nest Logger 展示应用侧心智模型，不包含 Prometheus Server、日志平台、OpenTelemetry Collector、SLO 或告警基础设施。
