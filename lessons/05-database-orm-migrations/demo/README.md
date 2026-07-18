# Lesson 05 Demo

本课用 TypeORM Repository、Migration 和 SQL.js 文件数据库替换内存 `Map`，保留前四课全部源码。项目不包含测试用例。

## 启动

```bash
cd lessons/05-database-orm-migrations/demo
cp .env.example .env
npm run start:dev
```

默认 API 为 `http://localhost:3005/api`，Swagger UI 为 `http://localhost:3005/docs`。首次启动会运行初始 Migration，并在当前目录创建 `lesson-05.sqlite`。

## 演示持久化

```bash
curl -i -X POST http://localhost:3005/api/notes \
  -H 'content-type: application/json' \
  -H 'x-api-key: learning-key' \
  -d '{"title":"Persistent note","content":"Stored by TypeORM"}'

curl -i http://localhost:3005/api/notes
```

停止应用、重新执行 `npm run start:dev`，再查询列表，记录仍然存在。需要重置时先停止应用，再删除本地数据库文件：

```bash
rm lesson-05.sqlite
```

## 验证与边界

```bash
npm run lint
npm run build
```

`DATABASE_PATH` 可在 `.env` 中调整。SQL.js 用于免外部依赖学习；生产环境迁移通常由部署流水线独立执行。
