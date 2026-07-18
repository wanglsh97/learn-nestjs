# Lesson 04 Demo

本课在前三课累计源码上加入 DTO 运行时校验、严格输入白名单和 Swagger/OpenAPI 文档。项目可独立启动，不包含测试用例。

## 启动

在仓库根目录安装依赖后执行：

```bash
cd lessons/04-rest-dto-validation-swagger/demo
cp .env.example .env
npm run start:dev
```

默认地址：

- API：`http://localhost:3004/api`
- Swagger UI：`http://localhost:3004/docs`

## 演示

读取当前内存列表：

```bash
curl -i http://localhost:3004/api/notes
```

创建合法笔记；响应为 `201`，字段首尾空格已被 Pipe 去除：

```bash
curl -i -X POST http://localhost:3004/api/notes \
  -H 'content-type: application/json' \
  -H 'x-api-key: learning-key' \
  -d '{"title":"  DTO boundary  ","content":"  validated at runtime  "}'
```

未知字段被严格白名单拒绝并返回 `400`：

```bash
curl -i -X POST http://localhost:3004/api/notes \
  -H 'content-type: application/json' \
  -H 'x-api-key: learning-key' \
  -d '{"title":"DTO","content":"validation","admin":true}'
```

省略 `x-api-key` 返回 `401`。访问 Swagger UI 后可以使用 Authorize 填入 `learning-key`，再直接调用 Notes 接口。

## 验证与边界

```bash
npm run lint
npm run build
```

数据仍保存在内存中，重启进程后清空。数据库持久化从第 5 课开始，完整 CRUD 和分页在第 6 课加入。
