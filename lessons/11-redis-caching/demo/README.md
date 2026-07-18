# Lesson 11 Demo

本课加入 Cache-Aside、TTL、写后失效，以及 Redis 不可用时的内存降级。项目不包含测试用例。

## 内存降级启动

```bash
cd lessons/11-redis-caching/demo
cp .env.example .env
REDIS_URL= npm run start:dev
```

登录后连续请求两次相同的 `GET /api/notes`，终端依次显示 cache miss 和 hit。创建或更新 Note 后再次查询会 miss，证明写后失效。

## Redis 启动

```bash
docker compose up -d redis
npm run start:dev
```

默认 API 为 `http://localhost:3011/api`，Swagger 为 `http://localhost:3011/docs`。Redis 连接失败或运行时操作失败时应用切换到内存缓存，基础请求仍可执行。

## 配置与验证

```bash
CACHE_TTL_SECONDS=0 npm run start
REDIS_URL=http://localhost:6379 npm run start
npm run lint
npm run build
```

前两条分别因无效 TTL 和协议在监听前失败。`docker compose down` 可停止本地 Redis；数据库和缓存运行文件均不提交。
