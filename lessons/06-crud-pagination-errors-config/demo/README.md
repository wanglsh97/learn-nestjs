# Lesson 06 Demo

本课在持久化 Notes API 上补齐 CRUD、分页筛选、统一异常响应和启动配置校验。项目不包含测试用例。

## 启动

```bash
cd lessons/06-crud-pagination-errors-config/demo
cp .env.example .env
npm run start:dev
```

默认 API 为 `http://localhost:3006/api`，Swagger UI 为 `http://localhost:3006/docs`。

## 演示

```bash
# 创建并记录响应 id
curl -i -X POST http://localhost:3006/api/notes \
  -H 'content-type: application/json' -H 'x-api-key: learning-key' \
  -d '{"title":"CRUD","content":"pagination and errors"}'

# 分页和搜索
curl -i 'http://localhost:3006/api/notes?page=1&pageSize=10&search=CRUD'

# 更新、读取、删除：把 <id> 替换为创建响应中的 id
curl -i -X PATCH http://localhost:3006/api/notes/<id> \
  -H 'content-type: application/json' -H 'x-api-key: learning-key' \
  -d '{"status":"published"}'
curl -i http://localhost:3006/api/notes/<id>
curl -i -X DELETE http://localhost:3006/api/notes/<id> -H 'x-api-key: learning-key'
```

删除返回 `204`。再次读取同一 ID 返回包含 `statusCode/message/path/timestamp` 的 `404`。

## 配置失败与静态验证

```bash
PORT=abc npm run start
npm run lint
npm run build
```

第一条命令应在监听端口前退出并提示 `PORT must be an integer between 1 and 65535`。数据库文件由 `DATABASE_PATH` 控制并被 Git 忽略。
