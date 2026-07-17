# NestJS Learning Demo

这是知识库配套的完整可运行项目。它实现了一个内存版 Notes API，重点展示 NestJS 的应用结构和请求生命周期，而不是数据库选型。

## 已覆盖能力

- 根模块、功能模块、Controller、Provider 和依赖注入
- `ConfigModule` 与环境变量
- DTO、`class-validator` 和全局 `ValidationPipe`
- API Key Guard
- 请求日志 Interceptor
- HTTP Exception Filter
- Swagger / OpenAPI
- Provider 单元测试与 HTTP E2E 测试

## 启动

```bash
cp .env.example .env
npm install
npm run start:dev
```

- Swagger：<http://localhost:3000/docs>
- 健康检查：<http://localhost:3000/api/health>

## API

| 方法 | 路径 | API Key | 说明 |
| --- | --- | --- | --- |
| GET | `/api/health` | 否 | 健康检查 |
| GET | `/api/notes` | 否 | 查询笔记，可用 `status` 过滤 |
| GET | `/api/notes/:id` | 否 | 查询单篇笔记 |
| POST | `/api/notes` | 是 | 创建笔记 |
| PATCH | `/api/notes/:id` | 是 | 更新笔记 |
| DELETE | `/api/notes/:id` | 是 | 删除笔记 |

需要保护的接口使用请求头 `x-api-key: learning-key`。可以通过 `.env` 中的 `DEMO_API_KEY` 修改。

## 说明

数据保存在进程内的 `Map` 中，应用重启后会清空。后续学习数据库时，可以将存储逻辑替换为 Repository Provider，同时保持 Controller 的 API 不变。
