# Lesson 08 Demo

本课增加 RBAC、角色元数据、`RolesGuard`、管理员种子和资源所有权判断。项目不包含测试用例。

## 启动

```bash
cd lessons/08-authorization-rbac/demo
cp .env.example .env
npm run start:dev
```

默认 API：`http://localhost:3008/api`；Swagger：`http://localhost:3008/docs`。启动会根据 `.env` 创建本地管理员。

## 演示

注册普通用户、复制其 Token，并创建一条笔记。随后登录管理员：

```bash
curl -i -X POST http://localhost:3008/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"admin@example.com","password":"admin-password"}'
```

把 `<id>` 和 Token 替换为实际值：

```bash
curl -i -X DELETE http://localhost:3008/api/notes/<id> \
  -H 'authorization: Bearer <user-token>'

curl -i http://localhost:3008/api/notes \
  -H 'authorization: Bearer <admin-token>'

curl -i -X DELETE http://localhost:3008/api/notes/<id> \
  -H 'authorization: Bearer <admin-token>'
```

普通用户删除返回 `403`；管理员列表包含其他用户的笔记，删除返回 `204`。第二个普通用户读取该 Note 时返回 `404`。

## 验证与边界

```bash
npm run lint
npm run build
```

`.env.example` 中管理员密码只用于本地学习。生产系统不应在每个应用实例启动时自动创建默认管理员。
