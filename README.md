# NestJS 知识库

这个仓库以**分类总结 NestJS 知识点**为主，以一个可运行的完整 API 为辅。目标不是堆放零散代码，而是让每个知识点都能回答三个问题：它解决什么问题、它在请求链路中的位置是什么、在真实项目中怎样使用。

## 仓库结构

```text
learn-nestjs/
├── docs/                  # 按主题组织的知识总结
├── examples/              # 适合单独理解的小型示例
└── demo/                  # 完整、可运行、可测试的 NestJS 应用
    ├── src/common/        # Guard、Interceptor、Filter 等横切能力
    ├── src/health/        # 健康检查功能模块
    ├── src/notes/         # Notes CRUD 功能模块
    └── test/              # E2E 测试
```

## 知识分类

| 分类 | 重点 |
| --- | --- |
| [基础与心智模型](docs/01-foundations/README.md) | Nest 的定位、IoC、装饰器、启动过程 |
| [核心组件](docs/02-core-components/README.md) | Module、Controller、Provider、依赖注入 |
| [请求生命周期](docs/03-request-lifecycle/README.md) | Middleware、Guard、Pipe、Interceptor、Filter |
| [数据与校验](docs/04-data-and-validation/README.md) | DTO、ValidationPipe、配置、持久化边界 |
| [认证与安全](docs/05-security/README.md) | 认证、授权、Guard、常见安全边界 |
| [测试](docs/06-testing/README.md) | 单元测试、集成测试、E2E 测试 |
| [工程化](docs/07-engineering/README.md) | 日志、Swagger、配置、构建与部署 |
| [进阶能力](docs/08-advanced/README.md) | WebSocket、微服务、队列、缓存、CQRS |

完整导航和建议学习顺序见 [docs/README.md](docs/README.md)。新增笔记时可复制 [知识点模板](docs/topic-template.md)。

## 运行完整 Demo

```bash
cd demo
cp .env.example .env
npm install
npm run start:dev
```

启动后可访问：

- API：`http://localhost:3000/api`
- Swagger：`http://localhost:3000/docs`
- 健康检查：`http://localhost:3000/api/health`

写接口使用演示用 API Key：

```bash
curl -X POST http://localhost:3000/api/notes \
  -H 'content-type: application/json' \
  -H 'x-api-key: learning-key' \
  -d '{"title":"Module","content":"Module 用来组织功能边界"}'
```

## 验证项目

在 `demo/` 中执行：

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

> Demo 当前使用内存存储，重启后数据会清空。这是刻意保留的学习边界，便于先理解 Nest 核心机制，再替换为数据库实现。

## License

本项目采用 [MIT License](LICENSE)。
