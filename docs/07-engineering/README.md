# 07. 工程化

## 配置管理

- 用环境变量区分部署环境，不在源码中写生产密钥。
- 启动时校验必要配置，尽早失败。
- 配置按业务域拆分，避免所有代码直接读取 `process.env`。

## 可观测性

- 日志至少包含请求方法、路径、耗时和可关联的请求 ID。
- 指标用于观察趋势，Tracing 用于定位跨服务链路。
- 健康检查要区分“进程存活”和“可以正常提供服务”。

## API 文档

Swagger 能从装饰器和 DTO 生成 OpenAPI 文档。文档必须与真实校验和权限规则同步，不能把 Swagger 当成仅供展示的附属页面。

## 构建与部署

- `npm run build` 产出 `dist/`，生产环境运行 `node dist/main`。
- 容器中使用多阶段构建并以非 root 用户运行。
- 实现优雅停机，让 HTTP 连接、数据库和消息消费者有机会完成清理。
- CI 至少执行依赖安装、Lint、构建、单元测试和 E2E 测试。

## 对照代码

- 请求日志：`demo/src/common/interceptors/request-logging.interceptor.ts`
- 健康检查：`demo/src/health`
- Swagger 和全局配置：`demo/src/app.setup.ts`
- 关闭钩子：`demo/src/main.ts`
