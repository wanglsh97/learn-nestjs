# Lesson 07 Demo

本课加入用户注册、bcrypt 密码哈希、JWT 登录、Passport Strategy、当前用户装饰器和 Notes 所有权隔离。项目不包含测试用例。

## 启动

```bash
cd lessons/07-jwt-authentication/demo
cp .env.example .env
npm run start:dev
```

默认 API：`http://localhost:3007/api`；Swagger UI：`http://localhost:3007/docs`。

## 注册、登录与受保护请求

```bash
curl -i -X POST http://localhost:3007/api/auth/register \
  -H 'content-type: application/json' \
  -d '{"email":"learner@example.com","password":"secure-password"}'

curl -i -X POST http://localhost:3007/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"learner@example.com","password":"secure-password"}'
```

从响应复制 `accessToken`：

```bash
curl -i http://localhost:3007/api/auth/me \
  -H 'authorization: Bearer <access-token>'

curl -i -X POST http://localhost:3007/api/notes \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer <access-token>' \
  -d '{"title":"Owned note","content":"JWT identifies the owner"}'

curl -i http://localhost:3007/api/notes \
  -H 'authorization: Bearer <access-token>'
```

省略或篡改 Token 返回 `401`。重复注册同一邮箱返回 `409`。使用第二个账号查询时不会看到第一个账号的笔记。

## 验证与边界

```bash
npm run lint
npm run build
```

`.env.example` 的 JWT Secret 仅供本地学习；不要用于部署。令牌刷新、撤销和角色授权不在本课实现，角色授权在第 8 课加入。
