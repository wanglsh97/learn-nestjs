# Lesson 12 Demo

本课在发布事务后提交后台任务，展示 BullMQ、重试退避、稳定 Job ID、Worker 生命周期和无 Redis 降级。项目不包含测试用例。

## 无 Redis 运行

```bash
cd lessons/12-queues-and-background-jobs/demo
cp .env.example .env
REDIS_URL= npm run start:dev
```

登录、创建 Note，再调用发布接口：

```bash
curl -i -X POST http://localhost:3012/api/notes/<id>/publish \
  -H 'authorization: Bearer <token>' \
  -H 'idempotency-key: publish-1'
```

响应为 `200`，随后日志出现 `Fallback job processed...`。重放相同请求不会再次处理同一 fallback Job。

## 使用 BullMQ

```bash
docker compose up -d redis
npm run start:dev
```

Worker 日志显示 `Notification generated...`。任务最多尝试 3 次并指数退避；同一 HTTP 幂等意图产生稳定 Job ID。

## 验证与边界

```bash
QUEUE_NAME=' ' npm run start
npm run lint
npm run build
```

空队列名在启动前失败。进程内降级不持久化；数据库提交与 Redis 入队之间仍需客户端重试或生产 Outbox 解决可靠投递。
