# Lesson 10 Demo

本课实现发布事务：Note 状态、审计记录和幂等记录原子提交；重复幂等键重放同一结果，幂等键与请求不匹配时返回冲突。项目不包含测试用例。

## 启动

```bash
cd lessons/10-transactions-concurrency-idempotency/demo
cp .env.example .env
npm run start:dev
```

默认 API：`http://localhost:3010/api`；Swagger：`http://localhost:3010/docs`。

## 演示

注册或登录后创建两条 Note，保存令牌和两个 ID：

```bash
curl -i -X POST http://localhost:3010/api/notes/<first-id>/publish \
  -H 'authorization: Bearer <token>' \
  -H 'idempotency-key: publish-1'
```

首次返回 `200` 和 `published`。重复同一命令返回相同 Note。把 URL 改成 `<second-id>` 但保留幂等键，返回 `409`；省略幂等键返回 `400`。

可以在两个终端同时执行相同发布命令，两个请求均返回同一资源，数据库主键负责解决首次插入竞争。

## 验证与边界

```bash
npm run lint
npm run build
```

SQL.js 便于本地观察事务。生产数据库需单独验证隔离级别、锁行为和唯一冲突错误；外部消息或邮件不属于该数据库事务。
